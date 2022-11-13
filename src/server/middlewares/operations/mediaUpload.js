import path from "node:path";
import fs from "node:fs";
import { logger } from "../../utils/logger.js";

export const mediaUpload = async (ctx, next) => {
  if (ctx.request.files && Object.keys(ctx.request.files).length > 0) {
    const __dirname = path.dirname("./");
    const privateFiles = ["account"];

    Object.keys(ctx.request.files).forEach((file) => {
      let leaveInPrivate = false;
      for (let i = 0; i < privateFiles.length; i++) {
        if (ctx.originalUrl.includes("/" + privateFiles[i] + "/")) {
          leaveInPrivate = true;
          break;
        }
      }
      //console.log("file", ctx.request.files[file]);
      let destinationFolder = ctx.request.files[file].mimetype.includes("image")
        ? "images"
        : ctx.request.files[file].mimetype.includes("video")
        ? "videos"
        : null;

      if (destinationFolder) {
        let folderPermission = leaveInPrivate ? "privatePath" : "globalPath";
        let newPath =
          path.join(__dirname, process.env[folderPermission]) +
          "/" +
          destinationFolder +
          "/" +
          ctx.request.files[file].newFilename;

        fs.rename(ctx.request.files[file].filepath, newPath, (err) => {
          if (err) {
            logger.error(err);
          }
          //insert new filepath
          ctx.request.files[file].filepath = newPath;
        });
      } else {
        delete ctx.request.files[file];
      }
    });
  }
  await next();
};
