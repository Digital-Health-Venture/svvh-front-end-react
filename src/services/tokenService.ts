import axios from "axios";
import { useLocation } from "react-router-dom";
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

    console.log({ response: response });

    const responseData = response.data as unknown as { IsSuccess: boolean; data: string };
    if (responseData.IsSuccess && responseData.data) {
      const decrypted = (response.data as { data: string }).data.split("&");

      if (!decrypted) {
        return undefined;
      }

      const innerObj: any = {};

      for (let i = 0; i < decrypted.length; i++) {
        const a = decrypted[i].split("=");
        innerObj[a[0].replace(" ", "")] = a[1];
      }

      const userData: UserData = {
        firstName: innerObj.firstname || "",
        lastName: innerObj.lastname || "",
        birthdate: innerObj.birthdate || innerObj.birthday || "",
        gender: innerObj.gender || "",
        // Using useLocation to retrieve query params like mobile or mobilephone
        tel:
          innerObj.tel ||
          getQueryParam("mobile") ||
          getQueryParam("mobilephone") ||
          "",
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

      console.log({ response: response });

      return response.status === 200;
    } catch (error: any) {
      if (error.response) {
        // The request was made and the server responded with a non-2xx status code
        const { status, data } = error.response;
        console.error(`Error ${status}: ${JSON.stringify(data)}`);

        if (status === 400 || status === 401) {
          alert("Access denied.");
        } else if (status === 403) {
          alert("Token expired due to inactivity, please try again.");
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error(`No response received: ${error.request}`);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error(`Error: ${error.message}`);
      }

      return false;
    }
  },
};

// Utility function to get query parameters from URL
const getQueryParam = (param: string) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  return queryParams.get(param);
};

export { tokenService };
