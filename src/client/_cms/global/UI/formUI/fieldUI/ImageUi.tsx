import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Image } from "../../../../components/Image";
import FileUploadForm from "../../../../components/auth/form/FileUploadForm";
import { APP_ADDRESS } from "../../../../utils/app.config";
import { ServerHandler } from "../../../functions/ServerHandler";
import Loading from "../../../../utils/Loading";

export const ImageUi = ({
  defaultValue,
  id,
  name,
  required,
  formData,
  handleInputData,
  uuidIdentifier,
  titleField,
}: {
  defaultValue?: any;
  id: string;
  name: string;
  required: boolean;
  formData: FormData;
  handleInputData: Function;
  titleField?: boolean;
  uuidIdentifier?: string;
}) => {
  const [previewImage, setPreviewImage]: any = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (defaultValue) {
      let defaultImported;
      if (typeof defaultValue === "string") {
        defaultImported = defaultValue;
      } else {
        defaultImported =
          defaultValue[uuidIdentifier ? uuidIdentifier : "uuid"];
      }

      if (isMounted && defaultImported)
        ServerHandler("/auth/media/images/" + defaultImported).then((res) => {
          //console.log("res", res);
          if (res && res.status === 200)
            setPreviewImage({
              path: APP_ADDRESS + "/" + res.data.styles.small,
              mediaTitle: res.data.title,
            });
        });
    }
    return () => {
      isMounted = false;
    };
  }, [defaultValue, uuidIdentifier]);

  const [view, setView]: any = useState(
    <ImagePreview
      handleInputData={handleInputData}
      media={previewImage ? previewImage : null}
      name={name}
      id={id}
      defaultValue={defaultValue}
      setPreviewImage={setPreviewImage}
      titleField={titleField}
    />
  );

  const switchToPreview: any = (media: string | null) => {
    setView(
      <ImagePreview
        handleInputData={handleInputData}
        media={media ? media : previewImage ? previewImage : null}
        name={name}
        id={id}
        defaultValue={defaultValue}
        setPreviewImage={setPreviewImage}
        titleField={titleField}
      />
    );
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted)
      setView(
        <ImagePreview
          handleInputData={handleInputData}
          media={previewImage ? previewImage : null}
          name={name}
          id={id}
          defaultValue={defaultValue}
          setPreviewImage={setPreviewImage}
          titleField={titleField}
        />
      );
    return () => {
      isMounted = false;
    };
  }, [defaultValue, handleInputData, id, name, previewImage, titleField]);

  const switchToUploadNew = () => {
    setView(
      <ImageUpload
        name={name}
        setPreviewImage={setPreviewImage}
        handleInputData={handleInputData}
      />
    );
  };
  const switchToLibrary = () => {
    setView(
      <ImageLibrary
        name={name}
        id={id}
        formData={formData}
        handleInputData={handleInputData}
        setPreviewImage={setPreviewImage}
      />
    );
  };

  return (
    <div id="image-ui">
      <div id="viewer">{view ? view : <Loading animation="throbber" />}</div>
      <div id="image-ui-buttons">
        <input
          type="button"
          value="Preview"
          onClick={() => switchToPreview(previewImage)}
        />
        <input type="button" value="Upload" onClick={switchToUploadNew} />
        <input type="button" value="Library" onClick={switchToLibrary} />
      </div>
    </div>
  );
};

const ImagePreview = ({
  handleInputData,
  media,
  name,
  id,
  defaultValue,
  setPreviewImage,
  titleField,
}: //uuidIdentifier,
{
  handleInputData: any;
  media: { path: string; mediaTitle?: string };
  name: string;
  id: string;
  defaultValue: { uuid: string; title?: string };
  setPreviewImage?: any;
  titleField?: boolean;
  //uuidIdentifier:string
}) => {
  const imageRemover = () => {
    setPreviewImage();
    handleInputData({
      name: name,
      id: id,
      type: "image",
      value: "",
    })();
  };

  return media && handleInputData ? (
    <>
      <span className="image-previewer-container">
        <img
          id={"image-previewer"}
          src={media.path}
          alt="preview"
          style={{ width: "100px" }}
        />
        {media && media.mediaTitle ? (
          <div className={"image-previewer-title"}>{media.mediaTitle}</div>
        ) : null}
        <input
          id="image-selected-remover"
          type="button"
          value="X"
          onClick={imageRemover}
        />
      </span>
      {titleField ? (
        <div className="image-ui-title">
          <label htmlFor={id + "-image-title"}>Title|</label>
          <input
            type="text"
            id={id + "-image-title"}
            name={id + "[title]"}
            onChange={(e: any) => {
              handleInputData({
                name: id + "[title]",
                id: id,
                type: "image",
                value: e.target.value,
              })();
            }}
            placeholder="(optional)"
            defaultValue={
              defaultValue && defaultValue.title ? defaultValue.title : ""
            }
            //required={true}
          />
        </div>
      ) : null}
    </>
  ) : (
    <Loading instantMessage={true} message="Add an Image" />
    /* <span id={"image-previewer"}></span> */
  );
};

const ImageLibrary = ({
  formData,
  name,
  id,
  setPreviewImage,
  handleInputData,
}: {
  formData: FormData;
  name: string;
  id: string;
  setPreviewImage: any;
  handleInputData: any;
}) => {
  const [library, setLibrary]: any = useState({});
  useEffect(() => {
    let isMounted = true;
    ServerHandler("/auth/media/images").then((res) => {
      setTimeout(() => {
        if (isMounted && res.status === 200) setLibrary(res.data);
      }, 2000);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const [imageChoice, setImageChoice]: any = useState(null);

  //console.log("library", library);

  const onSelect = () => {
    if (imageChoice && imageChoice.uuid) {
      setPreviewImage({
        path: APP_ADDRESS + "/" + imageChoice.styles.small,
        mediaTitle: imageChoice.title,
      });
    } else {
      setPreviewImage((prev: any) => prev);
    }
    handleInputData({
      name: name,
      id: id,
      type: "image",
      value: imageChoice && imageChoice.uuid ? imageChoice.uuid : "",
    })();
  };

  const deleteImage = (uuid: string) => {
    if (uuid)
      ServerHandler({
        method: "delete",
        endpoint: "/auth/media/images/delete/" + uuid,
      }).then((res) => {
        //console.log("res delete", res);
        toast(res.statusText);
        setPreviewImage(null);
      });
  };

  return library && !library.image ? (
    <Loading animation="throbber" />
  ) : library && library.image && library.image.length > 0 ? (
    <>
      <div className="grid grid-cols-4">
        {library.image.map((media: any) => {
          return (
            <span key={media.uuid} className="image-ui-library">
              <label htmlFor={media.uuid}>
                <Image
                  src={
                    media.styles && media.styles.small
                      ? media.styles.small
                      : media.path
                      ? media.path
                      : ""
                  }
                  alt={media.title}
                  display="overlay"
                  //entityUrl={media.alias}
                />
              </label>
              <input
                id={media.uuid}
                type="radio"
                //value="Select"
                name="media"
                onClick={() => setImageChoice(media)}
                defaultChecked={
                  formData &&
                  formData.has(name) &&
                  formData.get(name) === media.uuid
                    ? true
                    : false
                }
              />
              {media && media.uuid ? (
                <input
                  id="image-ui-library-delete-button"
                  type="button"
                  value="Delete"
                  onClick={() => deleteImage(media.uuid)}
                />
              ) : null}
            </span>
          );
        })}
      </div>

      <input
        id="image-ui-select-button"
        type="button"
        value="Select"
        //name={name}
        onClick={onSelect}
      />
    </>
  ) : (
    <Loading animation="throbber" message="No image found in library" />
  );
};

const ImageUpload = ({ setPreviewImage, handleInputData, name, id }: any) => {
  const uploadAction = (res: any) => {
    //console.log("the", res);
    if (res && res.data && res.data.path)
      setPreviewImage({
        path: APP_ADDRESS + "/" + res.data.styles.small,
        mediaTitle: res.data.title,
      });
    handleInputData({
      name: name,
      id: id,
      type: "image",
      value: res && res.data && res.data.uuid ? res.data.uuid : "",
    })();
  };
  return (
    <FileUploadForm
      nested={true}
      type="image"
      callback={(res: any) => uploadAction(res)}
    />
  );
};
