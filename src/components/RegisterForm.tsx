import axios from "axios";

import React, { useRef, useState, useEffect } from "react";

import { useForm } from "react-hook-form";

import { formatDate } from "../functions/formatDate";

import { OrbitProgress } from "react-loading-indicators";

import { RegisterFormType } from "../types/RegisterForm";

const RegisterForm: React.FC = () => {
  const { register, setValue, handleSubmit, trigger, reset } =
    useForm<RegisterFormType>();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const [scanType, setScanType] = useState<"idCard" | "passport">("idCard"); // State for scan type

  const [extractedData, setExtractedData] = useState<Partial<RegisterFormType>>(
    {}
  );

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
          // ID Card
          const extractedInfo = {
            firstName: docData?.name_en?.value || "",
            surname: docData?.surname_en?.value || "",
            idCardNumber: docData?.id_number?.value || "",
            birthday: formatDate(docData?.dob_en?.value || ""),
          };

          setExtractedData(extractedInfo);
        } else {
          // Passport
          const extractedInfo = {
            firstName: docData?.name_en?.value || "",
            surname: docData?.surname_en?.value || "",
            idCardNumber: docData?.passport_number?.value || "",
            birthday: formatDate(docData?.date_of_birth?.value || ""),
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

  const retakePhoto = () => {
    setExtractedData({});
    setCapturedImage(null);
    reset();
  };

  const onSubmit = (data: RegisterFormType) => {
    console.log("Submitted Data:", data);
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-lg">
      {isScanning && (
        <div className="flex justify-center self-center mb-4">
          <OrbitProgress color="#32cd32" size="medium" text="" textColor="" />
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">
        Register with {scanType === "idCard" ? "ID Card" : "Passport"} Scan
      </h2>

      {/* Selection Buttons */}
      <div className="flex space-x-4 mb-4">
        <button
          className={`p-2 rounded ${
            scanType === "idCard" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
          onClick={() => setScanType("idCard")}
        >
          Scan ID Card
        </button>
        <button
          className={`p-2 rounded ${
            scanType === "passport" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
          onClick={() => setScanType("passport")}
        >
          Scan Passport
        </button>
      </div>

      {!capturedImage ? (
        <div>
          <video
            ref={videoRef}
            className="w-full max-w-md bg-gray-200"
            playsInline
            autoPlay
            muted
          />
          <button
            onClick={startCamera}
            className="mt-2 mb-2 p-2 bg-blue-500 text-white rounded"
          >
            Start Camera
          </button>
          <button
            onClick={captureImage}
            className="mt-2 ml-2 mb-2 p-2 bg-green-500 text-white rounded"
          >
            Capture Image
          </button>
        </div>
      ) : (
        <div>
          <img
            src={capturedImage}
            alt="Captured ID"
            className="w-full max-w-md"
          />
          <button
            onClick={retakePhoto}
            className="mt-2 p-2 mb-2 bg-red-500 text-white rounded"
          >
            Retake
          </button>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input
          {...register("firstName")}
          placeholder="First Name"
          className="border p-2 w-full"
        />
        <input
          {...register("surname")}
          placeholder="Surname"
          className="border p-2 w-full"
        />
        <input
          {...register("idCardNumber")}
          placeholder="ID/Passport Number"
          className="border p-2 w-full"
        />
        <input
          type="date"
          {...register("birthday")}
          className="border p-2 w-full"
        />
        <input
          {...register("phoneNumber", { required: true })}
          placeholder="Phone Number"
          className="border p-2 w-full"
        />
        <input
          {...register("email")}
          placeholder="Email (Optional)"
          className="border p-2 w-full"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
