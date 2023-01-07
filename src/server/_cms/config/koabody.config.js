import path from "node:path";
import { NOT_ACCEPTABLE } from "../constants/statusCodes.js";
import serve from "koa-static-server";

const __dirname = path.dirname("./");
//type defines the kind/type of media
//type options: image/video
const media = (type) => {
  type = type.toLowerCase();
  return {
    multipart: true,
    formidable: {
      maxFileSize: type === "video" ? 20 * 1024 * 1024 : 2 * 1024 * 1024,
      filter: (part) => {
        //console.log("part", part);
        return (
          part.mimetype
            ? type === "image"
              ? part.mimetype.toLowerCase().includes("image/jpg") ||
                part.mimetype.toLowerCase().includes("image/jpeg") ||
                part.mimetype.toLowerCase().includes("image/png") ||
                part.mimetype.toLowerCase().includes("image/webp")
                ? true
                : false
              : type === "video"
              ? part.mimetype.toLowerCase().includes("video/mp4") ||
                part.mimetype.toLowerCase().includes("video/webm")
                ? true
                : false
              : false
            : false
        );
      },
      uploadDir: path.join(__dirname, process.env.tempFolder),
      keepExtensions: true,
      filename: (name, ext, form) => {
        return (
          process.env.appName +
          "-" +
          form.name +
          "-" +
          Date.now().toString() +
          ext
        );
      },
    },
    onError: (err, ctx) => {
      //formidable Error: image more than required size, CODE = 1009
      if (err.code === 1009)
        ctx.throw(NOT_ACCEPTABLE, "Media exceeds maximum allowed size");
      ctx.throw(err);
    },
  };
};
export { media };
