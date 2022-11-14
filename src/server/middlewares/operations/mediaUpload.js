import path from "node:path";
import fs from "node:fs";
import sharp from "sharp";
import { logger } from "../../utils/logger.js";

const imageProcessor = sharp({ failOn: "none" });
const __dirname = path.dirname("./");

const mediaUpload = async (ctx, next) => {
  if (ctx.request.files && Object.keys(ctx.request.files).length > 0) {
    const autoPrivatePaths = ["account"];
    //check if public boolean exist on request body
    let placeInPublic;
    if (ctx.request.body.public) {
      placeInPublic = true;
      for (let i = 0; i < autoPrivatePaths.length; i++) {
        if (ctx.originalUrl.includes("/" + autoPrivatePaths[i] + "/")) {
          placeInPublic = false;
          break;
        }
      }
      delete ctx.request.body.public;
    }

    //Only images are implemented for now
    Object.keys(ctx.request.files).forEach(async (file) => {
      //console.log("file", ctx.request.files[file]);
      let destinationFolder = ctx.request.files[file].mimetype.includes("image")
        ? "images"
        : ctx.request.files[file].mimetype.includes("video")
        ? "videos"
        : null;

      if (destinationFolder) {
        let folderPermission = !placeInPublic ? "privatePath" : "globalPath";
        let newPath =
          path.join(__dirname, process.env[folderPermission]) +
          "/" +
          destinationFolder +
          "/" +
          ctx.request.files[file].newFilename.split(".")[0];

        let smallSize = newPath + "_small.webp"; //240*240
        let obliqueSize = newPath + "_oblique.webp"; //480*240
        let squareSize = newPath + "_square.webp"; //480*480
        let mediumSize = newPath + "_medium.webp"; //640*360
        let wideSize = newPath + "_wide.webp"; //960*360
        let originalSize = newPath + ".webp"; //Untouched image size
        let imagesGroup = [];

        imagesGroup.push(
          imageProcessor.clone().resize(240, 240).toFile(smallSize)
        );
        imagesGroup.push(
          imageProcessor.clone().resize(480, 240).toFile(obliqueSize)
        );
        imagesGroup.push(
          imageProcessor.clone().resize(480, 480).toFile(squareSize)
        );
        imagesGroup.push(
          imageProcessor.clone().resize(640, 360).toFile(mediumSize)
        );
        imagesGroup.push(
          imageProcessor.clone().resize(960, 360).toFile(wideSize)
        );
        imagesGroup.push(imageProcessor.clone().toFile(originalSize));

        ReadableStream.pipe(imageProcessor);
        await Promise.all(imagesGroup)
          .then((res) => {
            console.log("done here!", res);
            /* //relocate image if there's need to
            fs.rename(ctx.request.files[file].filepath, newPath, (err) => {
              if (err) {
                logger.error(err);
              }
            }); */

            //insert new filepath for server use
            fs.unlinkSync(ctx.request.files[file].filepath);
            ctx.request.files[file].filepath = originalSize.split("public/")[1];
            //insert add-on image styles for database saving
            ctx.request.body.styles = {
              small: smallSize.split("public/")[1],
              oblique: obliqueSize.split("public/")[1],
              square: squareSize.split("public/")[1],
              medium: mediumSize.split("public/")[1],
              wide: wideSize.split("public/")[1],
            };
          })
          .catch((err) => {
            console.error("lets clean this up", err);
            try {
              fs.unlinkSync(smallSize);
              fs.unlinkSync(obliqueSize);
              fs.unlinkSync(squareSize);
              fs.unlinkSync(mediumSize);
              fs.unlinkSync(wideSize);
              fs.unlinkSync(ctx.request.files[file].filepath);
            } catch (e) {}
          });
      } else {
        delete ctx.request.files[file];
      }
    });
  }
  await next();
};

const avatarUpload = async (ctx, next) => {
  //console.log("file", ctx.request.files[file]);
  if (ctx.request.files && ctx.request.files["avatar"]) {
    let newPath =
      path.join(__dirname, process.env["privatePath"]) +
      "/images/" +
      ctx.request.files["avatar"].newFilename.split(".")[0] +
      ".webp";

    sharp(ctx.request.files["avatar"].filepath)
      .resize(240, 240)
      .toFile(newPath)
      .then((res) => {
        //console.log("done here!", res);
        //flush original file
        fs.unlinkSync(ctx.request.files["avatar"].filepath);
        //insert new filepath for server use
        ctx.request.files["avatar"].filepath = newPath.split("public/")[1];
      })
      .catch((err) => {
        //console.error("lets clean this up", err);
        try {
          fs.unlinkSync(newPath);
          fs.unlinkSync(ctx.request.files["avatar"].filepath);
        } catch (e) {}
      });
  } else {
    delete ctx.request.files["avatar"];
  }
  await next();
};

export { mediaUpload, avatarUpload };
