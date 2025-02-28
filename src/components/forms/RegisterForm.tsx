import React from "react";

import { OrbitProgress } from "react-loading-indicators";

import { RegisterFormProps } from "../../types/RegisterForm";

import ScanFrame from "../ScanFrame";

import { SVVH_LOGO } from "../../constants/assets";

import RegisterContentForm from "./RegisterContentForm";

import useOcrRegistration from "../../hooks/useOcrRegistration";

const RegisterForm: React.FC<RegisterFormProps> = ({
  open,
}: RegisterFormProps) => {
  const {
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
  } = useOcrRegistration({ open: open });

  return (
    <div className="w-full max-w-3xl border p-6 rounded-3xl shadow-md bg-white">
      {!showForm && !manualRegister && !capturedImage ? (
        <div>
          <div className="flex flex-col gap-y-1 justify-center items-center mb-4">
            <img
              src={SVVH_LOGO}
              width={172}
              height={40}
              className="max-h-16 mb-4"
              alt="svvh-logo"
            />
            <h2 className="text-xl font-semibold mb-4 text-center">
              ลงทะเบียนโดยการสแกนบัตรประชาชนหรือพาสปอร์ต
            </h2>
          </div>
          <div className="">
            <div className="flex space-x-1">
              <div
                className={`cursor-pointer p-2 rounded-tl-lg rounded-tr-lg ${
                  scanType === "idCard"
                    ? "bg-[#12663F] text-white"
                    : "bg-gray-300"
                }`}
                onClick={() => setScanType("idCard")}
              >
                บัตรประชาชน
              </div>
              <div
                className={`cursor-pointer p-2 rounded-tl-lg rounded-tr-lg ${
                  scanType === "passport"
                    ? "bg-[#12663F] text-white"
                    : "bg-gray-300"
                }`}
                onClick={() => setScanType("passport")}
              >
                พาสปอร์ต
              </div>
            </div>
          </div>
          <div className="relative w-full">
            <video
              ref={videoRef}
              className="w-full bg-gray-200"
              playsInline
              autoPlay
              muted
            />
            <ScanFrame />
            <div className="absolute top-1/2 left-0 w-full h-[0.1px] bg-red-500 transform -translate-y-1/2"></div>
          </div>

          <div className="flex flex-col gap-y-2 self-center justify-center items-center mt-2">
            <button
              onClick={captureImage}
              className="w-[250px] p-2 bg-[#12663F] text-white rounded-3xl"
            >
              สแกน{scanType === "idCard" ? "บัตรประชาชน" : "พาสปอร์ต"}
            </button>
            <button
              onClick={handleManualRegister}
              className="w-[250px] p-2 bg-gray-500 text-white rounded-3xl"
            >
              ลงทะเบียนด้วยตนเอง
            </button>
          </div>
        </div>
      ) : capturedImage ? (
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col gap-y-1 justify-center items-center mb-4">
            <img
              src={SVVH_LOGO}
              width={172}
              height={40}
              className="max-h-16 mb-4"
              alt="svvh-logo"
            />
            <h2 className="text-xl font-semibold mb-4 text-center">
              ยืนยันข้อมูลการลงทะเบียน
            </h2>
          </div>
          {isScanning ? (
            <OrbitProgress color="#12663F" size="medium" />
          ) : (
            <RegisterContentForm
              onSubmit={handleSubmit(onSubmit)}
              register={register}
              extractedData={extractedData}
              handleGoBack={handleGoBack}
            />
          )}
        </div>
      ) : manualRegister ? (
        <div>
          <div className="flex flex-col gap-y-1 justify-center items-center mb-4">
            <img
              src={SVVH_LOGO}
              width={172}
              height={40}
              className="max-h-16 mb-4"
              alt="svvh-logo"
            />
            <h2 className="text-xl font-semibold mb-4 text-center">
              ลงทะเบียนเพื่อใช้งานระบบ
            </h2>
          </div>
          <RegisterContentForm
            onSubmit={handleSubmit(onSubmit)}
            register={register}
            handleGoBack={handleGoBack}
          />
        </div>
      ) : null}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default RegisterForm;
