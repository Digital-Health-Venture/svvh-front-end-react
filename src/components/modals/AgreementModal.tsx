import React from "react";

import { AGREEMENT_TEXT } from "../../constants/agreement";

import { ArrowDownToLine } from "lucide-react";

import { AgreementModalProps } from "../../types/AgreementModalProps";

import useAgreementModal from "../../hooks/useAgreementModal";

import { SVVH_LOGO } from "../../constants/assets";

export default function AgreementModal({ open, onClose }: AgreementModalProps) {
  const {
    canAgree,
    checkboxChecked,
    contentRef,
    handleScrollToBottom,
    handleCheckboxChange,
    handleCloseModal,
  } = useAgreementModal(onClose);

  return (
    <>
      {open && (
        <div className="flex items-center justify-center fixed inset-0 z-50 bg-gray-600 bg-opacity-50">
          <div className="w-full max-w-2xl border p-6 rounded-3xl shadow-md relative bg-white">
            <div className="flex flex-col gap-y-2 justify-center items-center mb-4">
              <img
                src={SVVH_LOGO}
                width={172}
                height={40}
                className="max-h-16 mb-4"
                alt="svvh-logo"
              />
              <div className="flex flex-col gap-y-0.5 text-center">
                <h2 className="text-xl font-bold">
                  ข้อกำหนดและเงื่อนไขของบริการ
                </h2>
                <span>Samitivej Virtual Hospital</span>
              </div>
              <span className="mt-1 text-center">
                ปรับปรุงล่าสุดเมื่อวันที่ 1 กันยายน 2567
              </span>
            </div>
            <div className="relative">
              {/* Scrollable Content */}
              <div
                ref={contentRef}
                className="h-[350px] overflow-y-auto border p-2 mb-4 bg-gray-100 rounded"
              >
                {AGREEMENT_TEXT || "Default agreement text goes here..."}
              </div>

              {/* Arrow Button at Bottom-Right of Content */}
              {!canAgree && (
                <button
                  onClick={handleScrollToBottom}
                  className="absolute bottom-2 right-2 bg-white bg-opacity-75 rounded-full p-2 shadow transition hover:bg-blue-100"
                >
                  <ArrowDownToLine className="text-blue-500 w-8 h-8" />
                </button>
              )}
            </div>

            <div className="flex justify-center items-center gap-x-1 mt-4">
              <input
                type="checkbox"
                checked={checkboxChecked}
                onChange={handleCheckboxChange}
                id="agree-checkbox"
                className="mr-2"
              />
              <label htmlFor="agree-checkbox" className="text-sm text-gray-700">
                ฉันยอมรับข้อกำหนดและเงื่อนไข
              </label>
            </div>

            <div className="flex justify-center gap-x-4 mt-4 items-center">
              <button className="px-4 py-2 rounded-3xl text-blue-500 bg-white border border-blue-500 hover:bg-blue-200 w-[120px]">
                ย้อนกลับ
              </button>
              <button
                onClick={handleCloseModal}
                disabled={!checkboxChecked}
                className={`px-4 py-2 rounded-3xl text-white w-[120px] ${
                  checkboxChecked
                    ? "bg-[#12663F] hover:bg-green-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                ถัดไป
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
