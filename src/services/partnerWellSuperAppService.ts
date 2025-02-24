import { partnerService, Partner } from "./partnerService";
import { useLocation } from "react-router-dom"; // React Router
import { UserData } from "../model/User";
import axios from "axios";

export interface WellSuperApp extends Partner {
  guardianId: number | undefined;
}

// WellSuperApp service
const partnerWellSuperAppService = {
  isActive: () => {
    return !!getPartnerObject();
  },

  onIndexMounted: () => {
    const partner = getPartnerObject();
    if (!partner) return;

    const location = useLocation(); // Get current location

    const searchParams = new URLSearchParams(location.search);

    // Hospital ID should be passed from the well landing page.
    const hospitalId = searchParams.get("hospitalId");
    if (hospitalId) {
      partner.hospitalId = parseInt(hospitalId);
      setPartnerObject(partner);
    }

    // Parse guardian ID from query string.
    const guardianId = searchParams.get("gId");
    if (guardianId) {
      partner.guardianId = parseInt(guardianId);
      setPartnerObject(partner);
    }
  },

  onIndexMountedRequiredRegister: (userData: UserData | undefined) => {
    return (
      !userData?.firstName ||
      !userData?.lastName ||
      !userData?.tel ||
      !userData?.email
    );
  },

  onRegisterUpdateUserDataToWell: async (userData: UserData) => {
    let gender = userData.gender as string | null;
    if (gender === "ไม่ระบุ" || gender === "0" || !gender) {
      gender = null;
    } else {
      gender = gender.toLowerCase() === "male" || gender === "ชาย" ? "M" : "F";
    }

    const idToken = userData.idToken;

    const partner = getPartnerObject();
    if (partner && partner.guardianId) {
      const response = await axios.post(
        process.env.WELLSUPERAPP_GUARDIAN_UPDATE_URL as string,
        {
          updateGuardianReqBean: {
            guardianId: partner.guardianId,
            email: userData.email,
            passportId: userData.idCard,
            firstName: userData.firstName,
            lastName: userData.lastName,
            phoneNumber: userData.tel,
            birthDate: userData.birthdate,
            gender: gender,
          },
        },
        {
          headers: {
            Authorization: "Bearer " + idToken,
          },
        }
      );

      console.log({ WellUpdateGuardianResponse: response });
    } else {
      const response = await axios.post(
        process.env.WELLSUPERAPP_CUSTOMER_UPDATE_URL as string,
        {
          updateCustomerReqBean: {
            email: userData.email,
            passportId: userData.idCard,
            firstName: userData.firstName,
            lastName: userData.lastName,
            phoneNumber: userData.tel,
            birthDate: userData.birthdate,
            gender: gender,
          },
        },
        {
          headers: {
            Authorization: "Bearer " + idToken,
          },
        }
      );

      console.log({ WellUpdateCustomerResponse: response });
    }
  },
};

const getPartnerObject = () => {
  const partner = partnerService.getPartner();
  if (partner && partner.name === "WellSuperApp") {
    return partner as WellSuperApp;
  }
  return undefined;
};

const setPartnerObject = (partner: WellSuperApp) => {
  partnerService.setPartner(partner);
};

export { partnerWellSuperAppService };
