import { useEffect, useRef, useState } from "react";

const useAgreementModal = (onClose: () => void) => {
  const [canAgree, setCanAgree] = useState(false);

  const [checkboxChecked, setCheckboxChecked] = useState(false); // Track checkbox state

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
        setCanAgree(scrollTop + clientHeight >= scrollHeight - 10);
      }
    };

    if (contentRef.current) {
      contentRef.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (contentRef.current) {
        contentRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const handleScrollToBottom = () => {
    if (contentRef.current && !canAgree) {
      contentRef.current.scrollTo({
        top: contentRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const handleCheckboxChange = () => {
    setCheckboxChecked(!checkboxChecked);
  };

  const handleCloseModal = () => {
    onClose();
  };

  return {
    canAgree,
    checkboxChecked,
    contentRef,
    handleScrollToBottom,
    handleCheckboxChange,
    handleCloseModal,
  };
};

export default useAgreementModal;
