// import { GetterTree, ActionTree, MutationTree } from "vuex";
// import Agreement from "~/model/Agreement";

// export const state = () => {
//   return {
//     isLoading: false,
//     message: null,
//     warning: null,
//     agreement: null as Agreement | null,
//     partner: null,
//   };
// };

// export type RootState = ReturnType<typeof state>;

// export const mutations: MutationTree<RootState> = {
//   LOADING_START(state: any) {
//     console.log("Agreement loading start");
//     state.isLoading = true;
//   },
//   LOADING_END(state: any) {
//     console.log("Agreement loading end");
//     state.isLoading = false;
//   },
//   DATA_LOADED(state: any, agreement: Agreement) {
//     state.agreement = agreement;
//   },
//   ERROR(state: any, warning) {
//     state.warning = warning;
//   },
// };

// export const getters: GetterTree<RootState, RootState> = {
//   isLoading(state: any) {
//     return state.isLoading;
//   },
//   agreement(state: any) {
//     return state.agreement;
//   },
// };

// export const actions: ActionTree<RootState, RootState> = {
//   loadAgreement(
//     { commit },
//     payload: { agreementName: string; partnerName: string }
//   ) {
//     const bodyFormData = new FormData();
//     bodyFormData.append("AgreementName", payload.agreementName);
//     bodyFormData.append("PartnerName", payload.partnerName);

//     commit("LOADING_START");

//     this.$axios({
//       method: "post",
//       url: process.env.REACT_APP_BASE_URL_V2 + "/Agreement/GetAgreement",
//       data: bodyFormData,
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     })
//       .then((response: any) => {
//         if (response) {
//           console.log(response);
//           commit("DATA_LOADED", response.data.data);
//         }
//       })
//       .catch((err: any) => {
//         console.error("Load failed", err);
//         commit("ERROR", err.message);
//       })
//       .finally(() => {
//         commit("LOADING_END");
//       });
//   },
// };
