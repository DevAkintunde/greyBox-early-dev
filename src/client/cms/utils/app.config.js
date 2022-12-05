export const SITENAME_FULL = "Studio | Mellywood";
export const SITENAME = "Studio|M";

const API_ENDPOINT = "/api/v2";
export const SITEURL = "https://studio.mellywood.com";
const LOCAL_URL = "http://localhost:5173";

export const APP_ADDRESS =
  process.env.NODE_ENV === "development" ? LOCAL_URL : SITEURL;
export const REST_ADDRESS =
  (process.env.NODE_ENV === "development" ? LOCAL_URL : SITEURL) + API_ENDPOINT;

//access_token is saved by default if authenticationMethod is not set
export const authenticationMethod = "access_token";
export const saveTokenToLocalStorage = false;

//social media links
//export const brandEmail = "urban@mellywood.com";
export const brandEmail = "";
export const brandPhoneNo = 2348055163046;
export const brandWhatsapp = 2348055163046;
export const brandYoutube =
  "https://www.youtube.com/channel/UCRm1USq1gCuswpmfVm5c-Bw";
export const brandFacebook = "mellywoodurban";
export const brandInstagram = "mellywoodurban";
export const brandTwitter = "mellywoodurban";
