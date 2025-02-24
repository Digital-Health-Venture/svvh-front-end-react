import { partnerService, Partner } from "./partnerService";

interface Azay extends Partner {
  returnUrl: string;
}

// Azay service.
// This service is used to store and retrieve the Azay object.
//
const partnerAzayService = {
  isActive: () => {
    return !!getPartnerObject();
  },

  onIndexMounted: () => {
    const partner = getPartnerObject();
    if (!partner) return;

    partner.returnUrl = "https://success";
    setPartnerObject(partner);
  },
};

const getPartnerObject = () => {
  const partner = partnerService.getPartner();
  if (
    partner &&
    (partner.name.toLowerCase() === "allianzayudhya" ||
      partner.name.toLowerCase() === "azay")
  ) {
    return partner as Azay;
  }
  return undefined;
};

const setPartnerObject = (partner: Azay) => {
  partnerService.setPartner(partner);
};

export { partnerAzayService, Azay };
