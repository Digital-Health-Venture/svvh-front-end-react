import { partnerService, Partner } from "./partnerService";

interface Interpreter extends Partner {
  interpreterLanguage: string;
  code: string;
  imei: string;
}

// Interpreter service.
// This service is used to store and retrieve the Interpreter object.
const partnerInterpreterService = {
  isActive: (): boolean => {
    return !!getPartnerObject();
  },

  onIndexMounted: (): void => {
    const partner = getPartnerObject();
    if (!partner) return;

    const searchParams = new URLSearchParams(window.location.search);
    const interpreterLanguage = searchParams.get("interpreterLanguage") || "";
    const code = searchParams.get("code") || "";
    const imei = searchParams.get("im") || "";

    partner.interpreterLanguage = interpreterLanguage;
    partner.code = code;
    partner.imei = imei;
    setPartnerObject(partner);
  },
};

const getPartnerObject = (): Interpreter | undefined => {
  const partner = partnerService.getPartner();
  if (partner && partner.name.toLowerCase() === "interpreter") {
    return partner as Interpreter;
  }
  return undefined;
};

const setPartnerObject = (partner: Interpreter): void => {
  partnerService.setPartner(partner);
};

export { partnerInterpreterService, Interpreter };
