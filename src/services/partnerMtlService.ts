import { useState, useEffect } from "react";
import axios from "axios";
import { Partner, partnerService } from "./partnerService";
import { transactionService } from "./transactionService";
import { useLocation } from "react-router-dom"; // Use React Router to access the route parameters

interface MTL extends Partner {
  type: string;
  token: string;
  mobile: string;
  healthCardId: string;
  clientId: string;
  consentCode: string;
  refCode: string;
}

const partnerMtlService = () => {
  const [partner, setPartner] = useState<MTL | null>(null);
  const location = useLocation(); // Get the current location (route)

  const getPartnerObject = () => {
    const partnerData = partnerService.getPartner();
    if (partnerData && partnerData.name === "MTL") {
      setPartner(partnerData as MTL);
    }
  };

  const setPartnerObject = (partnerData: MTL) => {
    partnerService.setPartner(partnerData);
  };

  useEffect(() => {
    getPartnerObject();
  }, []);

  const isActive = () => {
    return !!partner;
  };

  const onIndexMounted = () => {
    if (!partner) return;

    const query = new URLSearchParams(location.search); // Use URLSearchParams to extract query parameters
    const type = query.get("type") || "MTL-TH";
    const mobile = query.get("mobile") || "";
    const healthcardid = query.get("healthcardid") || "";
    const clientId = query.get("clientId") || "";

    partner.type = type;
    partner.mobile = mobile;
    partner.healthCardId = healthcardid;
    partner.clientId = clientId;

    if (partner.userData) {
      const { firstName, lastName, idCard } = partner.userData;
      const hn = generateHnNumber(firstName, lastName, idCard);
      partner.userData.hn = hn;
      partner.userData.tel = mobile || partner.userData.tel || "ไม่ระบุ";
    }

    setPartnerObject(partner);
  };

  const getConsent = async (lang: string) => {
    try {
      const response = await axios.post(
        `${process.env.BASE_URL}/MuangthaiGetConsent`,
        {
          consentLanguage: lang.toUpperCase(),
        }
      );
      const data = response.data as { IsSuccess: boolean; data: any; consentLongText?: string; consentCode?: string; refCode?: string };
      if (data.IsSuccess) {
        const data = (response.data as { data: any }).data;
        if (partner) {
          partner.consentCode = data.consentCode;
          partner.refCode = data.refCode;
          setPartnerObject(partner);
        }
        return { consentLongText: data.consentLongText || "" };
      } else {
        throw new Error("Failed to get consent");
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const confirmConsent = async () => {
    if (!partner) return false;

    try {
      const response = await axios.post(
        `${process.env.BASE_URL}/MuangthaiConfirmConsent`,
        {
          consentCode: partner.consentCode,
          refCode: partner.refCode,
        },
        {
          headers: {
            "Content-Type": "application/json",
            CK: transactionService.getSessionCk(),
            SK: transactionService.getSessionSk(),
          },
        }
      );
      return (response.data as { IsSuccess: boolean }).IsSuccess;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const rejectConsent = async () => {
    if (!partner) return false;

    try {
      const response = await axios.post(
        `${process.env.BASE_URL}/MuangthaiRejectConsent`,
        {
          consentCode: partner.consentCode,
          refCode: partner.refCode,
        },
        {
          headers: {
            "Content-Type": "application/json",
            CK: transactionService.getSessionCk(),
            SK: transactionService.getSessionSk(),
          },
        }
      );
      return (response.data as { IsSuccess: boolean }).IsSuccess;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const onConfirmConsent = async () => {
    if (!partner || !partner.userData) return false;

    const hasBenefit = await getBenefit(
      partner.healthCardId,
      partner.userData.searchOption,
      partner.refCode,
      partner.clientId
    );

    if (!hasBenefit) {
      // handle error
    } else {
      // send notification and check queue
    }
  };

  const getBenefit = async (
    healthcard: string,
    searchOption: string,
    consentRefCode: string,
    clientId: string
  ) => {
    try {
      const response = await axios.post(
        `${process.env.BASE_URL}/MuangthaiGateway`,
        {
          ListId: healthcard,
          SearchOption: searchOption,
          ConsentRefCode: consentRefCode,
          ClientId: clientId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            CK: transactionService.getSessionCk(),
            SK: transactionService.getSessionSk(),
          },
        }
      );
      return (response.data as { IsSuccess: boolean }).IsSuccess
        ? { success: true, errorMessage: "" }
        : { success: false, errorMessage: (response.data as any).ErrMessage };
    } catch (error) {
      console.error(error);
      return { success: false, errorMessage: "Network Error" };
    }
  };

  const generateHnNumber = (
    firstName: string,
    lastName: string,
    card: string
  ) => {
    const getHash = (input: string) => {
      let hash = 0;
      for (let i = 0; i < input.length; i++) {
        hash = (hash << 5) - hash + input.charCodeAt(i);
        hash |= 0; // to 32bit integer
      }
      return hash.toString();
    };

    let hnConcat = card;
    if (!hnConcat || hnConcat === "null" || hnConcat === "undefined") {
      hnConcat = getHash(firstName + " " + lastName);
    }

    if (hnConcat === "undefined") {
      hnConcat = Date.now().toString();
    }

    return "MTL-" + hnConcat;
  };

  return {
    partner,
    isActive,
    onIndexMounted,
    getConsent,
    confirmConsent,
    rejectConsent,
    onConfirmConsent,
  };
};

export { partnerMtlService };
