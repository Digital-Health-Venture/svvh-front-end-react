import axios from "axios";
import { UserConsent, UserData } from "../model/User";
import { Partner } from "../services/partnerService";
import { Base64 } from "js-base64";
import { datadogRum } from "@datadog/browser-rum";

interface Session {
  CK: string;
  SK: string;
  transactionStatus: number;
  transactionProgress: number;
  callSessionId: string;
  callAccessToken: string;
  callUserId: string;
  callPatientName: string;
}

interface CheckQueueApiResponse {
  TransactionId: number;
  TransactionCode: string;
  TransactionSessionId: string;

  TransactionStatus: number;
  TransactionStatusText: string;
  TransactionTimeLeft: number;
  IsReview: boolean;
  TransactionSource: string;

  PatientId: number;
  PatientName: string;
  PatientImage: string;

  NurseId: number;
  NurseName: string;
  NurseImage: string;
  NurseSpecialty: string;

  DoctorId: number;
  DoctorName: string;
  DoctorImage: string;
  DoctorSpecialty: string;

  PharmacyId: number;
  PharmacyName: string;
  PharmacyImage: string;
  PharmacySpecialty: string;

  CallVendor: string;
  CallSessionId: string;
  CallAccessToken: string;
  CallUserId: string;
  IsHuawei: boolean;
}

const transactionService = {
  //
  initSession: async (partnerName: string) => {
    // Get session keys.
    const session = transactionService.getSession();

    try {
      // Get new session keys if not exist.
      const response = await axios.post<{ CK: string; SK: string }>(
        process.env.REACT_APP_BASE_URL_V2 + "/Transaction/GetSession",
        undefined,
        {
          headers: {
            CK: `${session?.CK ?? ""}`,
            SK: `${session?.SK ?? ""}`,
            "Hospital-Name": partnerName,
          },
        }
      );

      // If response contains new session keys, set them to local storage.
      if (response.data.CK && response.data.SK) {
        transactionService.setSession({
          CK: response.data.CK,
          SK: response.data.SK,
          transactionStatus: 0,
          transactionProgress: 0,
          callAccessToken: "",
          callSessionId: "",
          callUserId: "",
          callPatientName: "",
        });
      }

      return "";
    } catch (error) {
      console.log(error);
      return error;
    }
  },

  //
  setSession: (session: Session) => {
    const sessionString = JSON.stringify(session);
    const sessionBase64 = Base64.encode(sessionString);
    localStorage.setItem("SvhSession", sessionBase64);
  },

  //
  getSession: () => {
    const sessionBase64 = localStorage.getItem("SvhSession");

    if (!sessionBase64) {
      return undefined;
    }

    const sessionString = Base64.decode(sessionBase64);
    return JSON.parse(sessionString) as Session;
  },

  //
  getSessionCk: () => {
    return transactionService.getSession()?.CK ?? "";
  },

  //
  getSessionSk: () => {
    return transactionService.getSession()?.SK ?? "";
  },

  // Get transaction status.
  getTransactionStatus: () => {
    return transactionService.getSession()?.transactionStatus ?? 0;
  },

  // Get transaction progress.
  getTransactionProgress: () => {
    return transactionService.getSession()?.transactionProgress ?? 0;
  },

  // Register patient.
  register: async (
    userData: UserData,
    userConsent: UserConsent,
    partnerName: string,
    contactName?: string,
    isGuardianMode: boolean = false
  ) => {
    await transactionService.initSession(partnerName);

    const formData = new FormData();
    formData.append("HNNumber", userData.hn);
    formData.append("FirstName", userData.firstName);
    formData.append("LastName", userData.lastName);
    formData.append("BirthDate", userData.birthdate);
    formData.append("IDCard", userData.idCard);
    formData.append("Tel", userData.tel);
    formData.append("Email", userData.email);
    formData.append("Gender", userData.gender);
    formData.append("AgreementName", "UsageTerms");
    formData.append("Contact", contactName || partnerName || "Webview");
    formData.append("IsAcceptTerms", userConsent.isAcceptTerms.toString());
    formData.append(
      "IsConsent3rdParty",
      userConsent.isConsent3rdParty.toString()
    );
    formData.append(
      "IsConsentMarketing",
      userConsent.isConsentMarketing.toString()
    );
    formData.append("IsGuardianMode", isGuardianMode.toString());

    try {
      await axios.post(
        process.env.REACT_APP_BASE_URL_V2 + "/Transaction/Register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            CK: transactionService.getSessionCk(),
            SK: transactionService.getSessionSk(),
          },
        }
      );

      // Clear the 'callEnded' flag after successful registration
      localStorage.removeItem("callEnded");
    } catch (error) {
      console.error("Registration failed", error);
      throw error; // Re-throw the error so the calling function can handle it
    }
  },

  // Register appointment.
  registerAppointment: async (
    appointmentCode: string,
    appointmentPassword: string,
    partnerName: string
  ) => {
    try {
      await transactionService.initSession(partnerName);

      const formData = new FormData();
      formData.append("code", appointmentCode);
      formData.append("password", appointmentPassword);

      const response = await axios.post(
        process.env.REACT_APP_BASE_URL_V2 + "/Transaction/RegisterAppointment",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            CK: transactionService.getSessionCk(),
            SK: transactionService.getSessionSk(),
          },
        }
      );

      return response.status;
    } catch (e) {
      console.error("RegisterAppointmentFailed", e);
      return (e as any).response!.status;
    }
  },

  // Create queue.
  createQueue: async (
    partner: Partner,
    source?: string,
    partnerConsultId?: string
  ) => {
    try {
      const bodyFormData = new FormData();
      bodyFormData.append("isSupportH264", "false");
      bodyFormData.append("source", source || partner.name);
      bodyFormData.append("hospitalId", partner.hospitalId?.toString() ?? "");
      bodyFormData.append("AccessToken", partner.userData?.accessToken ?? "");
      bodyFormData.append("PartnerConsultId", partnerConsultId || "");
      bodyFormData.append("cvId", "1");

      const url =
        process.env.REACT_APP_BASE_URL_V2 + "/Transaction/CreateQueue";
      await axios.post(url, bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          CK: transactionService.getSessionCk(),
          SK: transactionService.getSessionSk(),
        },
      });
    } catch (error) {
      console.error("CreateQueueFailed", error);
    }
  },

  // Check queue.
  checkQueue: async () => {
    try {
      const response: any = await axios.post(
        process.env.REACT_APP_BASE_URL_V2 + "/Transaction/CheckQueue",
        undefined,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            CK: transactionService.getSessionCk(),
            SK: transactionService.getSessionSk(),
          },
        }
      );

      const data = response.data as CheckQueueApiResponse;

      const session = transactionService.getSession();

      if (!session) {
        return;
      }

      session.callAccessToken = data.CallAccessToken;
      session.callSessionId = data.CallSessionId;
      session.callUserId = data.CallUserId;
      session.callPatientName = data.PatientName;

      session.transactionStatus = data.TransactionStatus;
      if (data.TransactionStatus > session.transactionProgress) {
        session.transactionProgress = data.TransactionStatus;
      }
      transactionService.setSession(session);

      datadogRum.setUser({
        id: data.PatientId.toString(),
        name: data.PatientName,
      });

      return data;
    } catch (e) {
      console.error("CheckQueueFailed", e);
    }
  },

  // Cancel queue.
  cancelQueue: async () => {
    try {
      await axios.post(
        process.env.REACT_APP_BASE_URL_V2 + "/Transaction/CancelQueue",
        undefined,
        {
          headers: {
            "Content-Type": "application/json",
            CK: transactionService.getSessionCk(),
            SK: transactionService.getSessionSk(),
          },
        }
      );
    } catch (e) {
      console.error("CancelQueueFailed", e);
    }
  },

  // Rate transaction.
  rateTransaction: async (
    satisfactionRating: number,
    recommendationRating: number,
    comment: string
  ) => {
    try {
      const bodyFormData = new FormData();
      bodyFormData.append("SatisfactionRating", satisfactionRating.toString());
      bodyFormData.append(
        "RecommendationRating",
        recommendationRating.toString()
      );
      bodyFormData.append("Comment", comment);

      await axios.post(
        process.env.REACT_APP_BASE_URL_V2 + "/Transaction/Rate",
        bodyFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            CK: transactionService.getSessionCk(),
            SK: transactionService.getSessionSk(),
          },
        }
      );
    } catch (e) {
      console.error("RateTransactionFailed", e);
    }
  },

  // Request callback.
  requestCallback: async (symptom: string) => {
    try {
      const bodyFormData = new FormData();
      bodyFormData.append("Symptom", symptom);

      await axios.post(
        process.env.REACT_APP_BASE_URL_V2 + "/Transaction/RequestCallBack",
        bodyFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            CK: transactionService.getSessionCk(),
            SK: transactionService.getSessionSk(),
          },
        }
      );
    } catch (e) {
      console.error("RequestCallbackFailed", e);
    }
  },

  // Get control states.
  getControlStates: async () => {
    try {
      const url =
        process.env.REACT_APP_BASE_URL_V2 + "/Transaction/CheckControlStates";
      const response = await axios.post(url, undefined, {
        headers: {
          CK: transactionService.getSessionCk(),
          SK: transactionService.getSessionSk(),
        },
      });
      return response.data;
    } catch (e) {
      console.error("GetControlStatesFailed", e);
      return undefined;
    }
  },

  // Get consent.
  getConsent: async (input: { useInsurance: boolean }) => {
    try {
      const url =
        process.env.REACT_APP_BASE_URL_V2 + "/Transaction/VerifyConsent";
      const response = await axios.post(
        url,
        {
          useInsurance: input.useInsurance,
        },
        {
          headers: {
            CK: transactionService.getSessionCk(),
            SK: transactionService.getSessionSk(),
          },
        }
      );
      return response.data;
    } catch (e) {
      console.error("GetConsentFailed", e);
      return undefined;
    }
  },

  // Set consent.
  setConsent: async (input: ISetConsentInput) => {
    try {
      const url = process.env.REACT_APP_BASE_URL_V2 + "/Transaction/SetConsent";
      const response = await axios.post(
        url,
        {
          buCode: input.buCode,
          consent: input.consent,
        },
        {
          headers: {
            CK: transactionService.getSessionCk(),
            SK: transactionService.getSessionSk(),
          },
        }
      );
      return response.data;
    } catch (e) {
      console.error("SetConsentFailed", e);
      return undefined;
    }
  },

  // Record diagnostic event
  recordDiagnosticEvent: async (eventDescription: string) => {
    try {
      const bodyFormData = new FormData();
      bodyFormData.append("EventDescription", eventDescription);

      await axios.post(
        process.env.REACT_APP_BASE_URL_V2 +
          "/Transaction/RecordDiagnosticEvent",
        bodyFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            CK: transactionService.getSessionCk(),
            SK: transactionService.getSessionSk(),
          },
        }
      );
    } catch (e) {
      // console.log("RecordDiagnosticEvent");
    }
  },
};

export { transactionService };
export type { Session };

interface ISetConsentInput {
  buCode: string[];
  consent: {
    consentNumber: string;
    flag: boolean;
  }[];
}
