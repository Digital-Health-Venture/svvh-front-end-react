import { useLocation, useParams } from "react-router-dom";
import { DateTime } from "luxon";
import { Base64 } from "js-base64";
import { UserConsent, UserData } from "../model/User";
import MiddleFunction from "../mixins/MiddleFunction";
import { tokenService } from "./tokenService";

interface Partner {
  name: string;
  userToken: string;
  userData: UserData | undefined;
  userConsent: UserConsent;
  hospitalId: number | undefined;
  appointmentCode: string | undefined;
  createdAt: string;
}

const LOCALSTORAGE_KEY = "SvhPartner";

const partnerService = {
  // Initialize partner.
  // Get partner from query string.
  // Set partner object in local storage.
  // If partner is not found, clear local storage.
  initPartner: async (location: Location) => {
    // const location = useLocation();
    const params = new URLSearchParams(location.search);

    const partnerQueryString = params.get("partner") || "";
    const utmSourceQueryString = params.get("utm_source") || "";
    const tokenQueryString = params.get("token") || "";
    const appointmentCodeQueryString = params.get("code") || "";

    const partner: Partner = {
      name: partnerQueryString || utmSourceQueryString || "Webview",
      userToken: tokenQueryString ?? "",
      userData: undefined,
      userConsent: {
        isAcceptTerms: false,
        isConsent3rdParty: false,
        isConsentMarketing: false,
      },
      hospitalId: undefined,
      appointmentCode: appointmentCodeQueryString || undefined,
      createdAt: DateTime.local().toISO() as string,
    };

    if (partner.userToken) {
      partner.userData = await tokenService.decryptUserDataToken(
        partner.userToken,
        partner.name
      );
    }

    if (appointmentCodeQueryString) {
      partner.appointmentCode = appointmentCodeQueryString;
    }

    if (!partner.userData) {
      partner.userData = partnerService.initPartnerUserData(
        location as unknown as Location
      );
    }

    if (partner.userData) {
      partner.userData = partnerService.processPartnerUserData(
        partner.userData,
        partner.name
      );
    }

    // If user data is not found, try reading from local storage.
    if (!partner.userData) {
      const partnerLocalStorage = partnerService.getPartner();
      if (partnerLocalStorage && partnerLocalStorage.name === partner.name) {
        partner.userToken = partnerLocalStorage.userToken;
        partner.userData = partnerLocalStorage.userData;
      }
    }

    partnerService.setPartner(partner);

    return partner;
  },

  // Set partner object in local storage.
  // Encode partner object as base64 and store in local storage.
  setPartner: (partner: Partner) => {
    const partnerString = JSON.stringify(partner);
    const partnerBase64 = Base64.encode(partnerString);
    localStorage.setItem(LOCALSTORAGE_KEY, partnerBase64);
  },

  // Get partner object from local storage.
  // Decode partner object from base64.
  getPartner: () => {
    const partnerBase64 = localStorage.getItem(LOCALSTORAGE_KEY);
    if (partnerBase64) {
      const partnerString = Base64.decode(partnerBase64);
      const partner = JSON.parse(partnerString) as Partner;
      // If partner is not expired, return it.
      const createdAt = DateTime.fromISO(partner.createdAt);
      const now = DateTime.local();
      const diff = now.diff(createdAt, "hours");
      if (diff.hours < 2) {
        return partner;
      } else {
        return undefined;
      }
    }
    return undefined;
  },

  // Initialize partner user data from query string.
  initPartnerUserData: (location: Location) => {
    const params = new URLSearchParams(location.search);

    if (
      params.has("firstName") ||
      params.has("lastname") ||
      params.has("birthDate") ||
      params.has("birthdate") ||
      params.has("tel") ||
      params.has("telephone") ||
      params.has("idCard") ||
      params.has("email")
    ) {
      const userData: UserData = {
        firstName: params.get("firstName") || "",
        lastName: params.get("lastName") || "",
        birthdate: params.get("birthDate") || params.get("birthdate") || "",
        tel: params.get("tel") || "",
        idCard: params.get("idCard") || "",
        email: params.get("email") || "",
        gender: params.get("gender") || "",
        hn: params.get("hn") || "",
        accessToken: params.get("accessToken") || "",
        idToken: params.get("idToken") || "",
        searchOption: "",
      };
      return userData;
    } else {
      return undefined;
    }
  },

  // Process partner user data.
  processPartnerUserData: (userData: UserData, partnerName: string) => {
    // Process birthdate.
    if (userData.birthdate !== "" && !userData.birthdate.includes("-")) {
      let dateParts = userData.birthdate.split("/");
      if (dateParts.length === 1) {
        dateParts = userData.birthdate.split("-");
      }
      userData.birthdate =
        dateParts[2] + "-" + dateParts[1] + "-" + dateParts[0];
    }

    // Process gender.
    if (userData.gender !== "") {
      if (
        userData.gender.toLowerCase() === "male" ||
        userData.gender.toLowerCase() === "m"
      ) {
        userData.gender = "ชาย";
      } else if (
        userData.gender.toLowerCase() === "female" ||
        userData.gender.toLowerCase() === "f"
      ) {
        userData.gender = "หญิง";
      }
    }

    // Process hn.
    switch (partnerName.toLowerCase()) {
      case "thailife":
        userData.hn = `TL-${userData.idCard}`;
        break;
      case "sansiri":
        userData.hn = `SANSIRI-${userData.idCard}`;
        break;
      case "line":
        userData.hn = `LN-${userData.tel}`;
        break;
      case "Allianz":
        userData.hn = `Allianz-${MiddleFunction.methods._randomstring("tel")}`;
        break;
      default:
        userData.hn = userData.hn
          ? userData.hn
          : `Webview-${MiddleFunction.methods._randomstring("tel")}`;
        break;
    }

    return userData;
  },
};

export { partnerService, Partner };
