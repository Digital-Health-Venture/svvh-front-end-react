import { partnerService, Partner } from "./partnerService";

interface Line extends Partner {}

// Line service.
// This service is used to store and retrieve the Line object.
//
const partnerLineService = {
  isActive: () => {
    return !!getPartnerObject();
  },
};

const getPartnerObject = () => {
  const partner = partnerService.getPartner();
  if (partner && partner.name.toLowerCase() === "line") {
    return partner as Line;
  }
  return undefined;
};

const setPartnerObject = (partner: Line) => {
  partnerService.setPartner(partner);
};

export { partnerLineService };
