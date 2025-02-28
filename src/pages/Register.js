import React, { useState } from "react";

import RegisterForm from "../components/forms/RegisterForm";

import AgreementModal from "../components/modals/AgreementModal";

export default function Register() {
  // TO BE CHANGED DUE TO THE CONDITIONAL RENDERING

  const [isModalOpen, setIsModalOpen] = useState(true); // Initially, the modal is open

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal when user agrees to the terms
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-y-4">
      <AgreementModal open={isModalOpen} onClose={handleCloseModal} />
      <RegisterForm open={isModalOpen} />
    </div>
  );
}
