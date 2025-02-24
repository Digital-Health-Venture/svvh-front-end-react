import { useLocation } from "react-router-dom"; // React Router
import { Base64 } from "js-base64";
import axios from "axios";

interface System {
  language: string;
  acceptCookiesConsent: boolean;
  preCallReturnUrl: string;
  arrivalLink: string;
}

const systemServiceName = "SvhSystemV1.1";

const systemService = {
  // Initialize system
  initSystem: (location: Location) => {
    // const location = useLocation();  // Get current location
    const searchParams = new URLSearchParams(location.search);

    const languageQueryString =
      searchParams.get("language") || searchParams.get("lang") || "";

    const system: System = {
      language: languageCode[languageQueryString.toLowerCase()] || "th",
      acceptCookiesConsent: false,
      preCallReturnUrl: "",
      arrivalLink: window.location.href,
    };
    systemService.setSystem(system);
    return system;
  },

  // Get system from local storage
  getSystem: (location: Location): System => {
    const systemBase64 = localStorage.getItem(systemServiceName);

    if (!systemBase64) {
      systemService.initSystem(location);
      return systemService.getSystem(location);
    }

    const systemString = Base64.decode(systemBase64);
    return JSON.parse(systemString) as System;
  },

  // Set system in local storage
  setSystem: (system: System) => {
    const systemString = JSON.stringify(system);
    const systemBase64 = Base64.encode(systemString);
    localStorage.setItem(systemServiceName, systemBase64);
  },

  // Get language code
  getLanguageCode: (language: string) => {
    return languageCode[language];
  },

  // Get camera and microphone permission
  getUserMedia: async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      return true;
    } catch (e) {
      return false;
    }
  },

  // Get hospital ID
  getHospitalId: async (hospitalName: string) => {
    const url = process.env.BASE_URL_V2 + "/Hospital/Hospitals";
    const hospitals = (await axios.get(url)).data as {
      HospitalName: string;
      HospitalId: number;
    }[];

    return hospitals.find((h) => {
      return h.HospitalName === hospitalName;
    })?.HospitalId;
  },

  // Get agreement
  getAgreement: async (agreementName: string, partnerName: string) => {
    try {
      const bodyFormData = new FormData();
      bodyFormData.append("AgreementName", agreementName);
      bodyFormData.append("PartnerName", partnerName || "");

      const url = process.env.BASE_URL_V2 + "/Agreement/GetAgreement";
      const response = await axios.post(url, bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return (response.data as any).data as {
        AgreementId: number;
        AgreementTextTh: string;
        AgreementHeaderTh: string;
        AgreementHtmlTh: string;
        AgreementTextEn: string;
        AgreementHeaderEn: string;
        AgreementHtmlEn: string;
        AgreementName: string;
        HospitalId: number;
      };
    } catch (e) {
      console.error("GetAgreementFailed", e);
      return undefined;
    }
  },

  // Get user activation code hn
  getUserActivationCodeHn: async (code: string) => {
    try {
      const url = process.env.BASE_URL_V2 + "/UserActivation/GetHn";
      const response = await axios.post(url, {
        activationCode: code,
      });
      const data = response.data as { hn: string };
      return data.hn;
    } catch (e) {
      console.error("GetUserActivationCodeHnFailed", e);
      return undefined;
    }
  },

  // Get browser test identity
  getBrowserTestIdentity: async () => {
    try {
      const url = process.env.BASE_URL_V2 + "/Acs/GetBrowserTestIdentity";
      const response = await axios.get(url);
      return response.data as {
        identity: string;
        token: string;
      };
    } catch (e) {
      console.error("GetBrowserTestIdentityFailed", e);
      return undefined;
    }
  },

  // Get pre call return url
  getPreCallReturnUrl: (location: Location) => {
    const system = systemService.getSystem(location);
    return system.preCallReturnUrl;
  },

  // Set pre call return url
  setPreCallReturnUrl: (url: string, location: Location) => {
    const system = systemService.getSystem(location);
    system.preCallReturnUrl = url;
    systemService.setSystem(system);
  },
};

const languageCode = {
  th: "th",
  thai: "th",
  en: "en",
  english: "en",
} as {
  [key: string]: string;
};

export { systemService, System };
