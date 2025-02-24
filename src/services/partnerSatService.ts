import { partnerService, Partner } from "./partnerService";
import axios from "axios";
import { useLocation } from "react-router-dom"; // Import useLocation from React Router

interface Sat extends Partner {
  serviceOption: string; // 1 = SAT, 2 = SVH
}

// Sat service.
// This service is used to store and retrieve the Sat object.
//
const partnerSatService = {
  isActive: () => {
    return !!getPartnerObject();
  },

  onIndexMounted: (location: Location) => {
    const partner = getPartnerObject();
    // const location = useLocation(); // Get current route's location
    
    if (!partner) return;

    const serviceOption = new URLSearchParams(location.search).get("serviceOption"); // Extract query param from URL
    if (serviceOption) {
      partner.serviceOption = serviceOption;
      setPartnerObject(partner);
    }
  },

  onWaitingGetLoading: () => {
    const partner = getPartnerObject();
    if (partner?.serviceOption === "1") {
      return "sat";
    } else {
      return "svh";
    }
  },

  onResetPasswordMounted: (location: Location) => {
    // const location = useLocation();
    return new URLSearchParams(location.search).get("t") || ""; // Extract token query param from URL
  },

  resetPassword: async (token: string, newPassword: string) => {
    try {
      const response = await axios.post(
        process.env.BASE_URL_V2 + `/Sat/ResetPassword`,
        {
          ForgotPasswordToken: token,
          Password: newPassword,
        }
      );
      return response.status === 200;
    } catch (e) {
      console.log(e);
      return false;
    }
  },

  resetPin: async (token: string, newPin: string) => {
    try {
      const response = await axios.post(
        process.env.BASE_URL_V2 + `/Sat/ResetPin`,
        {
          ForgotPasswordToken: token,
          Pin: newPin,
        }
      );
      return response.status === 200;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
};

const getPartnerObject = () => {
  const partner = partnerService.getPartner();
  if (partner && partner.name === "SAT") {
    return partner as Sat;
  }
  return undefined;
};

const setPartnerObject = (partner: Sat) => {
  partnerService.setPartner(partner);
};

export { partnerSatService, Sat };
