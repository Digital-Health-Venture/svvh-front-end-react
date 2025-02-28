import React from "react";

const ScanFrame = () => {
  return (
    <div className="absolute inset-0 pointer-events-none hidden md:flex">
      {/* <!-- Top-Left Corner --> */}
      <div className="absolute top-20 left-20 w-6 h-6 md:w-8 md:h-8 border-t-[0.1px] border-l-[0.1px] border-white"></div>
      {/* <!-- Top-Right Corner --> */}
      <div className="absolute top-20 right-20 w-6 h-6 md:w-8 md:h-8 border-t-[0.1px] border-r-[0.1px] border-white"></div>
      {/* <!-- Bottom-Left Corner --> */}
      <div className="absolute bottom-20 left-20 w-6 h-6 md:w-8 md:h-8 border-b-[0.1px] border-l-[0.1px] border-white"></div>
      {/* <!-- Bottom-Right Corner --> */}
      <div className="absolute bottom-20 right-20 w-6 h-6 md:w-8 md:h-8 border-b-[0.1px] border-r-[0.1px] border-white"></div>
    </div>
  );
};

export default ScanFrame;
