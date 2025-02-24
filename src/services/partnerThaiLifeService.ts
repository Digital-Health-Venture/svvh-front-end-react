import { partnerService, Partner } from "./partnerService";

interface ThaiLife extends Partner {}

// ThaiLife service.
// This service is used to store and retrieve the ThaiLife object.
//
const partnerThaiLifeService = {
  isActive: () => {
    return !!getPartnerObject();
  },
};

const getPartnerObject = () => {
  const partner = partnerService.getPartner();
  if (partner && partner.name.toLowerCase() === "thailife") {
    return partner as ThaiLife;
  }
  return undefined;
};

const setPartnerObject = (partner: ThaiLife) => {
  partnerService.setPartner(partner);
};

export { partnerThaiLifeService, ThaiLife };
