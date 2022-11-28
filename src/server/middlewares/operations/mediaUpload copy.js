import path from "node:path";
import fs from "node:fs";
import sharp from "sharp";
import Image from "../../models/entities/media/Image.model.js";
import sequelize from "../../config/db.config.js";

const __dirname = path.dirname("./");

const mediaUpload = async (ctx, next) => {
  let promises = [];
  let imageStyles = {};
  let mediaDumpDirFromFormidable = [];

  //create image entities
  let CreateNewImage = [];

  if (ctx.request.files && Object.keys(ctx.request.files).length > 0) {
    //mandatorily send files to private DIR if on the autoPrivatePath array
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

    let imageAddOnSizes = [
      {
        pathSuffix: "_small.webp", //smallSize
        size: { width: 240, height: 240 },
        name: "small",
      },
      {
        pathSuffix: "_oblique.webp", //obliqueSize
        size: { width: 480, height: 240 },
        name: "oblique",
      },
      {
        pathSuffix: "_square.webp", //squareSize
        size: { width: 480, height: 480 },
        name: "square",
      },
      {
        pathSuffix: "_medium.webp", //mediumSize
        size: { width: 640, height: 360 },
        name: "medium",
      },
      {
        pathSuffix: "_wide.webp", //wideSize
        size: { width: 960, height: 360 },
        name: "wide",
      },
    ];

    //contruct functions to progress data
    //Only images are implemented for now

    Object.keys(ctx.request.files).forEach((file) => {
      let destinationFolder = ctx.request.files[file].mimetype.includes("image")
        ? "images"
        : ctx.request.files[file].mimetype.includes("video")
        ? "videos"
        : null;

      //set media Directory
      let newPath;
      if (destinationFolder && destinationFolder === "images") {
        let folderPermission = !placeInPublic ? "privatePath" : "globalPath";
        newPath =
          process.env[folderPermission] +
          "/" +
          destinationFolder +
          "/" +
          ctx.request.files[file].newFilename.split(".")[0];
      }
      //record this formidable dump file for later deletion
      mediaDumpDirFromFormidable.push(ctx.request.files[file].filepath);

      //convert main image to webp format
      let originalPath = newPath + ".webp";
      let promiseCall = () =>
        new Promise(function (resolve) {
          resolve(
            sharp(ctx.request.files[file].filepath)
              .toFile(originalPath)
              .then(async (res) => {
                //console.log("done original!", res);
                //flush original file
                //fs.unlinkSync(ctx.request.files[file].filepath);
                //insert new path as filepath for server use
                let thisNewPath = originalPath.split("public/")[1];
                ctx.request.files[file].filepath = thisNewPath;
                let imageTitle;
                let imageAlias;
                console.log("get file name:", file);
                //check if paragraph entity and extract image metadata
                if (file.includes("body[")) {
                  let formDataIdDepth = file.split("][")[0];
                  let paragraphID = formDataIdDepth.split("body[")[1];
                  console.log("paragraphID:", paragraphID);
                  imageTitle =
                    ctx.request.body["body"][paragraphID]["image"]["title"];
                  console.log("imageTitle:", imageTitle);
                  imageAlias =
                    ctx.request.body["body"][paragraphID]["image"]["alias"];
                } //check if other type of image field
                else if (file.includes("image")) {
                  imageTitle =
                    ctx.request.body["file"] &&
                    ctx.request.body["file"]["title"]
                      ? ctx.request.body["file"]["title"]
                      : null;
                  imageAlias =
                    ctx.request.body["file"] &&
                    ctx.request.body["file"]["alias"]
                      ? ctx.request.body["file"]["alias"]
                      : null;
                }

                CreateNewImage.push({
                  id: file,
                  title: imageTitle
                    ? imageTitle
                    : ctx.request.files[file].newFilename,
                  path: thisNewPath,
                  alias: imageAlias
                    ? imageAlias
                    : ctx.request.files[file].newFilename,
                });
              })
              .catch((err) => {
                //console.error("lets clean original", err);
                try {
                  fs.unlinkSync(originalPath);
                  fs.unlinkSync(ctx.request.files[file].filepath);
                  return err;
                } catch (e) {}
              })
          );
        });
      promises.push(promiseCall());

      //addOn styles per image
      imageAddOnSizes.forEach((style) => {
        const thisPath = newPath + style.pathSuffix;

        promises.push(
          new Promise(function (resolve) {
            resolve(
              sharp(ctx.request.files[file].filepath)
                .resize(style.size)
                .toFile(thisPath)
                .then((res) => {
                  //console.log("done addOn! " + thisPath, res);
                  if (imageStyles[file]) {
                    imageStyles[file] = {
                      ...imageStyles[file],
                      [style.name]: thisPath.split("public/")[1],
                    };
                  } else {
                    imageStyles = {
                      ...imageStyles,
                      [file]: { [style.name]: thisPath.split("public/")[1] },
                    };
                  }
                })
                .catch((err) => {
                  //console.error("lets clean this up", err);
                  try {
                    fs.unlinkSync(thisPath);
                    return null;
                  } catch (e) {}
                })
            );
          })
        );
      });
    });

    if (promises.length > 0) {
      await Promise.all(promises).then((res) => {
        mediaDumpDirFromFormidable.forEach((media) => {
          fs.unlinkSync(media);
        });
      });
      console.log("imageStyles", imageStyles);

      ctx.request.body = { ...ctx.request.body, styles: imageStyles };
    }
  }
  if (CreateNewImage && CreateNewImage.length > 0) {
    try {
      console.log("CreateNewImage", CreateNewImage);
      //let createdImages =
      await sequelize.transaction(async (t) => {
        let batchCreatedImages = [];
        let batchIDs = [];
        /* CreateNewImage.forEach((image) => {
          batchIDs.push(image.id);
          batchCreatedImages.push(
            Image.create(
              {
                title: image.title,
                path: image.path,
                alias: image.alias,
                styles:
                  imageStyles && imageStyles[image.id]
                    ? imageStyles[image.id]
                    : null,
              },
              {
                transaction: t,
              }
            )
          );
        }); */
        //ctx.throw(SERVICE_UNAVAILABLE, "Unable to create media");
        console.log("222");
        batchIDs = await Promise.all(batchCreatedImages);
        let mediaGroup = {};
        console.log("333", batchIDs);
        batchIDs.forEach((media) => {
          mediaGroup = {
            ...mediaGroup,
            [media]: media,
          };
        });
        console.log("444", mediaGroup);
        ctx.request.body = {
          ...ctx.request.body,
          media: mediaGroup,
        };
        return;
      });
    } catch (err) {
      try {
        return err;
      } catch (e) {}
    }
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
