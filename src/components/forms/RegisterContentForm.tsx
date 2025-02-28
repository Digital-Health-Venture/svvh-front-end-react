import React from "react";

import { RegisterContentFormProps } from "../../types/RegisterForm";

const RegisterContentForm = ({
  onSubmit,
  register,
  extractedData,
  handleGoBack,
}: RegisterContentFormProps) => (
  <form onSubmit={onSubmit} className="space-y-3">
    <input
      {...(register("firstName"), { required: true })}
      placeholder="ชื่อ *"
      defaultValue={extractedData?.firstName}
      className="border p-2 w-full rounded-2xl"
    />
    <input
      {...(register("surname"), { required: true })}
      placeholder="นามสกุล *"
      defaultValue={extractedData?.surname}
      className="border p-2 w-full rounded-2xl"
    />
    <input
      {...(register("idCardNumber"), { required: true })}
      placeholder="เลขบัตรประจำตัวประชาชน/เลขพาสปอร์ต *"
      defaultValue={extractedData?.idCardNumber}
      className="border p-2 w-full rounded-2xl"
    />
    <input
      type="date"
      {...(register("birthday"), { required: true })}
      defaultValue={extractedData?.birthday}
      className="border p-2 w-full rounded-2xl"
    />
    <input
      {...register("phoneNumber", { required: true })}
      placeholder="เบอร์โทรศัพท์ *"
      className="border p-2 w-full rounded-2xl"
    />
    <input
      {...register("email")}
      placeholder="อีเมล (ถ้ามี)"
      className="border p-2 w-full rounded-2xl"
    />
    <div className="flex flex-col gap-y-2 self-center justify-center items-center mt-2">
      <button
        type="submit"
        className="w-[250px] bg-[#12663F] text-white p-2 rounded-3xl"
      >
        ลงทะเบียน
      </button>
      <button
        onClick={handleGoBack}
        className="px-4 py-2 rounded-3xl text-[#12663F] bg-white border border-[#12663F] hover:bg-svvh-light-green w-[250px]"
      >
        ย้อนกลับ
      </button>
    </div>
  </form>
);

export default RegisterContentForm;
