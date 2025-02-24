// Partner: SVH
const svhLogo = require("../assets/image/logo.png");
const svhLoading = require("../assets/image/load_04.gif");

// Partner: SAT
const satLogo = require("../assets/image/logo_SAT.png");
const satLoading = require("../assets/image/load_SAT.gif");

// Partner: Interpreter
const flagJP = require("../assets/image/flag_jp.svg");
const flagCN = require("../assets/image/flag_cn.svg");
const flagKR = require("../assets/image/flag_kr.svg");
const flagFR = require("../assets/image/flag_fr.svg");
const flagAE = require("../assets/image/flag_ae.svg");
const flagMN = require("../assets/image/flag_mn.svg");

// Partner: TytoCare
const tytoCareLogo = require("../assets/image/logo_tytocare.svg");

// Common
const stepsTh = require("../assets/image/steps_th.svg");
const stepsEn = require("../assets/image/steps_en.svg");
const supportStaff = require("../assets/image/support_staff.svg");
const nurse = require("../assets/image/icon_nurse.png");
const doctor = require("../assets/image/icon_doctor.png");
const idCard = require("../assets/image/1_0.png");
const passport = require("../assets/image/1_0EN.png");
const point = require("../assets/image/point_rate.png");
const noPoint = require("../assets/image/nopoint_rate.png");
const connectFail = require("../assets/image/connect_fail_icon.png");
const chromeLogo = require("../assets/image/chrome_logo.svg");
const wellSuperAppHome = require("../assets/image/home.svg");

const assetService = {
  getLogo: (partnerName: string) => {
    switch (partnerName.toLowerCase()) {
      case "sat":
        return satLogo;
      default:
        return svhLogo;
    }
  },
  getSteps: (language: string) => {
    switch (language.toLowerCase()) {
      case "th":
        return stepsTh;
      default:
        return stepsEn;
    }
  },
  getSupportStaff: () => {
    return supportStaff;
  },
  getChromeLogo: () => {
    return chromeLogo;
  },
  getPreparePassport: (language: string) => {
    switch (language.toLowerCase()) {
      case "th":
        return idCard;
      default:
        return passport;
    }
  },
  getNurse: () => {
    return nurse;
  },
  getDoctor: () => {
    return doctor;
  },
  getLoading: (partnerName: string) => {
    switch (partnerName.toLowerCase()) {
      case "sat":
        return satLoading;
      default:
        return svhLoading;
    }
  },
  getPoint: () => {
    return point;
  },
  getNoPoint: () => {
    return noPoint;
  },
  getFlag: (language: string) => {
    switch (language.toLowerCase()) {
      case "jp":
        return flagJP;
      case "cn":
        return flagCN;
      case "kr":
        return flagKR;
      case "fr":
        return flagFR;
      case "ae":
        return flagAE;
      case "mn":
        return flagMN;
      default:
        return flagJP;
    }
  },
  getTytoCareLogo: () => {
    return tytoCareLogo;
  },
  getConnectFail: () => {
    return connectFail;
  },
  getWellSuperAppHome: () => {
    return wellSuperAppHome;
  },
};

export { assetService };