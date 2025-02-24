import { partnerService, Partner } from "./partnerService";
import { useLocation } from "react-router-dom";

interface ALive extends Partner {
  aliveConsultId: string;
}


// ALive service.
// This service is used to store and retrieve the ALive object.
const partnerAliveService = {
  isActive: (): boolean => {
    return !!getPartnerObject();
  },

  onIndexMounted: (location: Location): void => {
    // const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const crimsonConsultId = searchParams.get("CrimsonConsultId");

    const partner = getPartnerObject();
    if (!partner) return;

    if (crimsonConsultId) {
      partner.aliveConsultId = crimsonConsultId;
      setPartnerObject(partner);
    }
  },

  // Get deep link URL.
  // Deep link URL consists of access token and alive consult ID.
  getDeepLinkUrl: (): string => {
    const partner = getPartnerObject();
    if (!partner) return "";

    const accessToken = partner.userData?.accessToken ?? "";
    const partnerConsultId = partner.aliveConsultId ?? "";

    return `crimson://page/NPSFeedback?AccessToken=${accessToken}&CrimsonConsultId=${partnerConsultId}`;
  },
};

const getPartnerObject = (): ALive | undefined => {
  const partner = partnerService.getPartner();
  if (partner && partner.name.toLowerCase() === "alive") {
    return partner as ALive;
  }
  return undefined;
};

const setPartnerObject = (partner: ALive): void => {
  partnerService.setPartner(partner);
};

export { partnerAliveService, ALive };
