// string and arrayed string Model id mapping to databse tables
// available for query path mapping to the proper model names as well.

//import App specific Models if exist
import { ModelMapper as AppModels } from "../../app.config.js";

const cmsModelsMapper = {
  blog: "Blog",
  pages: "Page",
  admin: "Admin",
  accounts: "Admin",
  user: "Admin",
  author: "Admin",
  //access: 'UserAccessTimestamps',
  verify: "OTP",
  image: "Image",
  video: "Video",
  images: "Image",
  videos: "Video",
  media: ["Image", "Video"],
  "all-nodes": ["Blog", "Page"],
  "nodes": ["Blog", "Page"],
};

const ModelMapper =
  AppModels && Object.keys(AppModels).length > 0
    ? { ...cmsModelsMapper, app: AppModels }
    : cmsModelsMapper;

export { ModelMapper };
//exports.purview : ["Page", "Blog"];
//exports.managerial : ["Page", "Blog", "Account"];
