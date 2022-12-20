// string and arrayed string Model id mapping to databse tables
// available for query path mapping to the proper model names as well.

//import App specific Models if exist
import { ModelMapper as AppModels } from "../../appRoute.js";

const cmsModelsMapper = {
  blog: "Blog",
  pages: "Page",
  admin: "Admin",
  author: "Admin",
  verify: "OTP",
  image: "Image",
  video: "Video",
  images: "Image",
  videos: "Video",
  media: ["Image", "Video"],
};

const ModelMapper = AppModels
  ? { ...cmsModelsMapper, ...AppModels }
  : cmsModelsMapper;

export { ModelMapper };
//exports.purview : ["Page", "Blog"];
//exports.managerial : ["Page", "Blog", "Account"];
