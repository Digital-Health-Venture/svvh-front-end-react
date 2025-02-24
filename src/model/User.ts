export default interface User {
  firstName: string;
  lastName: string;
  birthDate: Date;
  pid: string;
  phone: string;
  email: string;
}

export interface UserData {
  firstName: string;
  lastName: string;
  birthdate: string;
  gender: string;
  tel: string;
  email: string;
  idCard: string;
  hn: string;
  accessToken: string;
  idToken: string;
  searchOption: string;
}

export interface UserConsent {
  isAcceptTerms: boolean;
  isConsent3rdParty: boolean;
  isConsentMarketing: boolean;
}
