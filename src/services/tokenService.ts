import axios from "axios";
import { UserData } from "../model/User";

const tokenService = {
  decryptUserDataToken: async (token: string, partnerName: string) => {
    const formData = new FormData();
    const decodedToken = decodeURIComponent(token);
    const fixedToken = decodedToken.replace(/ /g, "+");
    formData.append("token", fixedToken);
    formData.append("partner", partnerName);
    const response = await axios.post(
      process.env.BASE_URL_V2 + "/Token/Decrypt",
      formData
    );

    console.log({ response });

    const responseData = response.data as unknown as { IsSuccess: boolean; data: string };
    if (responseData.IsSuccess && responseData.data) {
      const decrypted = response.data.data.split("&");

      if (!decrypted) {
        return undefined;
      }

      const innerObj: any = {};

      for (let i = 0; i < decrypted.length; i++) {
        const a = decrypted[i].split("=");
        innerObj[a[0].replace(" ", "")] = a[1];
      }

      // Use window.location.search instead of a React hook
      const search = window.location.search;
      const userData: UserData = {
        firstName: innerObj.firstname || "",
        lastName: innerObj.lastname || "",
        birthdate: innerObj.birthdate || innerObj.birthday || "",
        gender: innerObj.gender || "",
        tel: innerObj.tel || getQueryParam("mobile", search) || getQueryParam("mobilephone", search) || "",
        email: innerObj.email || "",
        idCard: innerObj.idcard || innerObj.cardid || "",
        hn: innerObj.hn || "",
        accessToken: innerObj.accesstoken || "",
        idToken: innerObj.idToken || "",
        searchOption: innerObj.searchOption || "",
      };

      // Post process accessToken.
      if (userData.accessToken) {
        const accessGranted = await tokenService.verifyAccessToken(
          userData.accessToken,
          partnerName
        );
        if (!accessGranted) {
          userData.accessToken = "";
        }
      }

      return userData;
    } else {
      return undefined;
    }
  },

  verifyAccessToken: async (accessToken: string, partnerName: string) => {
    try {
      const formData = new FormData();
      formData.append("accessToken", accessToken);
      formData.append("partner", partnerName);
      const response = await axios.post(
        process.env.BASE_URL_V2 + "/Token/VerifyAccessToken",
        formData
      );

      console.log({ response });

      return response.status === 200;
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;
        console.error(`Error ${status}: ${JSON.stringify(data)}`);

        if (status === 400 || status === 401) {
          alert("Access denied.");
        } else if (status === 403) {
          alert("Token expired due to inactivity, please try again.");
        }
      } else if (error.request) {
        console.error(`No response received: ${error.request}`);
      } else {
        console.error(`Error: ${error.message}`);
      }

      return false;
    }
  },
};

// Utility function to get query parameters from a URL string
const getQueryParam = (param: string, search: string) => {
  const queryParams = new URLSearchParams(search);
  return queryParams.get(param) || "";
};

export { tokenService };