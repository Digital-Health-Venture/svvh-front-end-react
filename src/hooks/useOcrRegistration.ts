import { useEffect, useRef, useState } from "react";

import { useForm } from "react-hook-form";

import axios from "axios";

import { RegisterFormProps, RegisterFormType } from "../types/RegisterForm";

import { formatDateIdCard, formatDatePassport } from "../functions/formatDate";

const useOcrRegistration = ({ open }: RegisterFormProps) => {
  const { register, setValue, handleSubmit, trigger, reset } =
    useForm<RegisterFormType>();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [scanType, setScanType] = useState<"idCard" | "passport">("idCard");
  const [extractedData, setExtractedData] = useState<Partial<RegisterFormType>>(
    {}
  );
  const [manualRegister, setManualRegister] = useState(false);
  const [isStartCamera, setIsStartCamera] = useState(false);

  // Start the camera automatically when the modal is closed (open becomes false)
  useEffect(() => {
    if (!open || isStartCamera) {
      startCamera();
    }
  }, [open, isStartCamera]);

  useEffect(() => {
    if (Object.values(extractedData).some((val) => val)) {
      Object.entries(extractedData).forEach(([key, value]) => {
        if (value) {
          setValue(key as keyof RegisterFormType, value, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
      });
      trigger();
    }
  }, [extractedData, setValue, trigger]);

  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  const startCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Camera not supported on this device or browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: isMobile ? "environment" : "user" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (error) {
      console.error("Camera access error:", error);
      alert("Failed to access camera. Please check permissions.");
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context?.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      const imageData = canvasRef.current.toDataURL("image/png");
      setCapturedImage(imageData);
      stopCamera();
      setIsStartCamera(false);
      processOCR(imageData);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const processOCR = async (imageData: string) => {
    setIsScanning(true);

    try {
      const base64Image = imageData.split(",")[1];
      const payload = { image: base64Image };

      const API_KEY_OCR = process.env.REACT_APP_API_KEY_OCR;
      const URL_ENDPOINT_OCR =
        scanType === "idCard"
          ? process.env.REACT_APP_URL_ENDPOINT_OCR_ID_CARD
          : process.env.REACT_APP_URL_ENDPOINT_OCR_PASSPORT;

      const apiConfig = {
        endpoint: URL_ENDPOINT_OCR || "",
        apiKey: API_KEY_OCR || "",
      };

      const response = await axios.post(apiConfig.endpoint, payload, {
        headers: {
          "X-AIGEN-KEY": apiConfig.apiKey,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 && response.data?.data?.length > 0) {
        const docData = response.data.data[0];
        if (scanType === "idCard") {
          const extractedInfo = {
            firstName: docData?.name_en?.value || "",
            surname: docData?.surname_en?.value || "",
            idCardNumber: docData?.id_number?.value || "",
            birthday: formatDateIdCard(docData?.dob_en?.value || ""),
          };
          setExtractedData(extractedInfo);
        } else {
          const extractedInfo = {
            firstName: docData?.name_en?.value || "",
            surname: docData?.surname_en?.value || "",
            idCardNumber: docData?.passport_number?.value || "",
            birthday: formatDatePassport(docData?.date_of_birth?.value || ""),
          };
          setExtractedData(extractedInfo);
        }
      } else {
        alert("OCR processing failed. Try again.");
      }
    } catch (error) {
      console.error("OCR API Error:", error);
      alert("Error processing OCR. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };

  const onSubmit = (data: RegisterFormType) => {
    console.log("Submitted Data:", data);
  };

  const handleGoBack = () => {
    setCapturedImage(null); // Clear the captured image
    setIsStartCamera(true);
    setExtractedData({}); // Clear extracted data
    reset(); // Reset the form
    setManualRegister(false);
  };

  const handleManualRegister = () => {
    setManualRegister(true);
    setShowForm(false);
    setIsStartCamera(false);
    stopCamera();
  };

  return {
    register,
    handleSubmit,
    videoRef,
    canvasRef,
    capturedImage,
    isScanning,
    showForm,
    setScanType,
    scanType,
    extractedData,
    manualRegister,
    captureImage,
    onSubmit,
    handleGoBack,
    handleManualRegister,
  };
};

export default useOcrRegistration;
