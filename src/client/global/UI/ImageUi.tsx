import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Image } from "../../components/Image";
import FileUploadForm from "../../components/auth/form/FileUploadForm";
import { APP_ADDRESS } from "../../utils/app.config";
import { ServerHandler } from "../functions/ServerHandler";
import { Throbber } from "../../components/blocks/Throbber";

export const ImageUi = ({
  defaultValue,
  id,
  name,
  required,
  formData,
  handleInputData,
}: {
  defaultValue: any;
  id: string;
  name: string;
  required: boolean;
  formData: FormData;
  handleInputData: Function;
}) => {
  const imageDefaultPreview = defaultValue
    ? APP_ADDRESS + "/" + defaultValue
    : null;
  const [previewImage, setPreviewImage] = useState(imageDefaultPreview);

  const [view, setView]: any = useState(
    <ImagePreview
      handleInputData={handleInputData}
      image={previewImage}
      name={name}
      setPreviewImage={setPreviewImage}
    />
  );

  const switchToPreview: any = (image: string | null) => {
    setView(
      <ImagePreview
        handleInputData={handleInputData}
        image={image ? image : previewImage}
        name={name}
        setPreviewImage={setPreviewImage}
      />
    );
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted)
      setView(
        <ImagePreview
          handleInputData={handleInputData}
          image={previewImage ? previewImage : null}
          name={name}
          setPreviewImage={setPreviewImage}
        />
      );
    return () => {
      isMounted = false;
    };
  }, [handleInputData, name, previewImage]);

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
        formData={formData}
        handleInputData={handleInputData}
        setPreviewImage={setPreviewImage}
      />
    );
  };

  return (
    <div id="image-ui">
      <div id="viewer">{view ? view : <Throbber />}</div>
      <div>
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
  image,
  name,
  setPreviewImage,
}: {
  handleInputData: any;
  image: string | null;
  name: string;
  setPreviewImage?: any;
}) => {
  /* useEffect(() => {
    document
      .querySelector("input#image-selected-remover")
      ?.addEventListener("click", () => {
        setPreviewImage(null);
      });

    return () => {};
  }, [setPreviewImage]); */
  const imageRemover = () => {
    setPreviewImage(null);
    handleInputData({
      id: name,
      type: "image",
      value: "",
    })();
  };

  return image && handleInputData ? (
    <span>
      <img
        id={"image-previewer"}
        src={image}
        alt="preview"
        style={{ width: "100px" }}
      />
      <input
        id="image-selected-remover"
        type="button"
        value="Remove"
        onClick={imageRemover}
      />
    </span>
  ) : (
    <span id={"image-previewer"}>Add an Image</span>
  );
};

const ImageLibrary = ({
  formData,
  name,
  setPreviewImage,
  handleInputData,
}: {
  formData: FormData;
  name: string;
  setPreviewImage: any;
  handleInputData: any;
}) => {
  const [library, setLibrary]: any = useState({});
  useEffect(() => {
    let isMounted = true;
    ServerHandler("/auth/media/images").then((res) => {
      if (isMounted && res.status === 200) setLibrary(res.data);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const [imageChoice, setImageChoice]: any = useState(null);

  //console.log("imageChoice", imageChoice);

  const onSelect = () => {
    if (imageChoice && imageChoice.uuid) {
      setPreviewImage(APP_ADDRESS + "/" + imageChoice.path);
    } else {
      setPreviewImage((prev: any) => prev);
    }
    handleInputData({
      id: name,
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
    <Throbber />
  ) : library && library.image && library.image.length > 0 ? (
    <>
      <div className="grid grid-cols-4">
        {library.image.map((media: any) => {
          return (
            <span key={media.uuid}>
              <label htmlFor={media.uuid}>
                <Image
                  src={media.path}
                  alt={media.title}
                  display="overlay"
                  //entityUrl={media.alias}
                />
              </label>
              <input
                id={media.uuid}
                type="radio"
                value="Select"
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
                  //id="image-ui-delete-button"
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
    <div>No image found in library</div>
  );
};

const ImageUpload = ({ setPreviewImage, handleInputData, name }: any) => {
  const uploadAction = (res: any) => {
    //console.log("the", res);
    if (res && res.data && res.data.path)
      setPreviewImage(APP_ADDRESS + "/" + res.data.path);
    handleInputData({
      id: name,
      type: "image",
      value: res && res.data && res.data.uuid ? res.data.uuid : "",
    })();
  };
  return (
    <FileUploadForm type="image" callback={(res: any) => uploadAction(res)} />
  );
};
