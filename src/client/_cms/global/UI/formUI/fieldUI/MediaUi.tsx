import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Video } from "../../../../components/Video";
import { APP_ADDRESS } from "../../../../utils/app.config";
import { ServerHandler } from "../../../functions/ServerHandler";
import Loading from "../../../../utils/Loading";
import { jsStyler } from "../../../functions/jsStyler";
import { Image } from "../../../../components/Image";
import FileUploadUi from "../FileUploadUi";

export const MediaUi = ({
  defaultValue,
  id,
  name,
  type,
  required,
  formData,
  handleInputData,
  uuidIdentifier,
  titleField,
}: {
  defaultValue?: any;
  id: string;
  name: string;
  type: string;
  required: boolean;
  formData: FormData;
  handleInputData: Function;
  titleField?: boolean;
  uuidIdentifier?: string;
}) => {
  const [previewMedia, setPreviewMedia]: any = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (defaultValue) {
      let defaultImported: string;
      if (typeof defaultValue === "string") {
        defaultImported = defaultValue;
      } else {
        defaultImported =
          defaultValue[uuidIdentifier ? uuidIdentifier : "uuid"];
      }

      if (isMounted && defaultImported)
        ServerHandler(`/auth/media/${type}s/` + defaultImported).then((res) => {
          //console.log("res", res);
          if (res && res.status === 200)
            setPreviewMedia({
              path:
                type === "video"
                  ? res.data.source === "hosted"
                    ? APP_ADDRESS + "/" + res.data.path
                    : res.data.path
                  : APP_ADDRESS + "/" + res.data.styles.small,
              mediaTitle: res.data.title,
              uuid: defaultImported,
            });
        });
    }
    return () => {
      isMounted = false;
    };
  }, [defaultValue, type, uuidIdentifier]);

  // force remove previewImage attributes
  const [setPreviewToNull, setSetPreviewToNull]: [boolean, any] =
    useState(false);

  const [view, setView]: any = useState(
    <MediaPreview
      handleInputData={handleInputData}
      media={previewMedia ? previewMedia : null}
      name={name}
      id={id}
      type={type}
      defaultValue={defaultValue}
      setPreviewMedia={setPreviewMedia}
      titleField={titleField}
      setSetPreviewToNull={setSetPreviewToNull}
    />
  );

  const switchToPreview: any = (media: string | null) => {
    setView(
      <MediaPreview
        handleInputData={handleInputData}
        media={media ? media : previewMedia ? previewMedia : null}
        name={name}
        id={id}
        type={type}
        defaultValue={defaultValue}
        setPreviewMedia={setPreviewMedia}
        titleField={titleField}
        setSetPreviewToNull={setSetPreviewToNull}
      />
    );
  };

  useEffect(() => {
    let isMounted = true;
    if ((isMounted && previewMedia && previewMedia.path) || setPreviewToNull) {
      //clear forced null value of preview
      if (setPreviewToNull) {
        setSetPreviewToNull(false);
        setPreviewMedia(null);
      }
      setView(
        <MediaPreview
          handleInputData={handleInputData}
          media={setPreviewToNull ? null : previewMedia ? previewMedia : null}
          name={name}
          id={id}
          type={type}
          defaultValue={defaultValue}
          setPreviewMedia={setPreviewMedia}
          titleField={titleField}
          setSetPreviewToNull={setSetPreviewToNull}
        />
      );
    }
    return () => {
      isMounted = false;
    };
  }, [
    defaultValue,
    handleInputData,
    id,
    name,
    previewMedia,
    setPreviewToNull,
    titleField,
    type,
  ]);

  /* const switchToAddNewRemote = () => {
    setView(
      <MediaRemoteAdd
        name={name}
        setPreviewMedia={setPreviewMedia}
        handleInputData={handleInputData}
      />
    );
  }; */
  const switchToUploadNew = () => {
    setView(
      <MediaUpload
        type={type}
        name={name}
        setPreviewMedia={setPreviewMedia}
        handleInputData={handleInputData}
      />
    );
  };
  const switchToLibrary = () => {
    setView(
      <MediaLibrary
        name={name}
        id={id}
        type={type}
        formData={formData}
        handleInputData={handleInputData}
        previewMedia={previewMedia}
        setPreviewMedia={setPreviewMedia}
      />
    );
  };

  return (
    <div id="media-ui">
      <div id="viewer">{view ? view : <Loading animation="throbber" />}</div>
      <div id="media-ui-buttons">
        <input
          type="button"
          value="Preview"
          onClick={() => switchToPreview(previewMedia)}
        />
        <input
          type="button"
          value={type === "video" ? "Add New Video Url" : "Upload"}
          onClick={switchToUploadNew}
        />
        <input type="button" value="Library" onClick={switchToLibrary} />
      </div>
    </div>
  );
};

const MediaPreview = ({
  handleInputData,
  media,
  name,
  id,
  type,
  defaultValue,
  setPreviewMedia,
  titleField,
  setSetPreviewToNull,
}: //uuidIdentifier,
{
  handleInputData: any;
  media: { path: string; mediaTitle?: string };
  name: string;
  id: string;
  type: string;
  defaultValue: { uuid: string; title?: string };
  setPreviewMedia?: any;
  titleField?: boolean;
  setSetPreviewToNull: any;
  //uuidIdentifier:string
}) => {
  const mediaRemover = () => {
    handleInputData({
      name: name,
      id: id,
      type: type === "video" ? "video" : "image",
      value: "",
    })();
    setSetPreviewToNull(true);
  };

  return media && handleInputData ? (
    <>
      <span className="media-previewer-container">
        <img
          id={"media-previewer"}
          src={media.path}
          alt="preview"
          style={{ width: "100px" }}
        />
        {media && media.mediaTitle ? (
          <div className={"media-previewer-title"}>{media.mediaTitle}</div>
        ) : null}
        <input
          id="media-selected-remover"
          type="button"
          value="X"
          onClick={mediaRemover}
        />
      </span>
      {titleField ? (
        <div className="media-ui-title">
          <label htmlFor={id + "-media-title"}>Title|</label>
          <input
            type="text"
            id={id + "-media-title"}
            name={id + "[title]"}
            onChange={(e: any) => {
              handleInputData({
                name: id + "[title]",
                id: id,
                type: type === "video" ? "video" : "image",
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
    <Loading
      instantMessage={true}
      message={type === "video" ? "Add a Video" : "Add an Image"}
    />
    /* <span id={"media-previewer"}></span> */
  );
};

const MediaLibrary = ({
  formData,
  name,
  id,
  type,
  previewMedia,
  setPreviewMedia,
  handleInputData,
}: {
  formData: FormData;
  name: string;
  id: string;
  type: string;
  previewMedia: any;
  setPreviewMedia: any;
  handleInputData: any;
}) => {
  const [library, setLibrary]: any = useState({});
  useEffect(() => {
    let isMounted = true;
    ServerHandler(`/auth/media/${type}s`).then((res) => {
      console.log("res: ", res);
      setTimeout(() => {
        if (isMounted && res.status === 200) setLibrary(res.data);
      }, 1000);
    });
    return () => {
      isMounted = false;
    };
  }, [type]);

  const [mediaChoice, setMediaChoice]: any = useState(null);

  console.log("library", library);

  const onSelect = useCallback(
    (e: any) => {
      if (e) e.preventDefault();
      if (mediaChoice && mediaChoice.uuid) {
        setPreviewMedia({
          path:
            type === "video"
              ? mediaChoice.source === "hosted"
                ? APP_ADDRESS + "/" + mediaChoice.path
                : mediaChoice.path
              : APP_ADDRESS + "/" + mediaChoice.styles.small,
          mediaTitle: mediaChoice.title,
          uuid: mediaChoice.uuid,
        });
      } else {
        setPreviewMedia((prev: any) => prev);
      }
      handleInputData({
        name: name,
        id: id,
        type: type === "video" ? "video" : "image",
        value: mediaChoice && mediaChoice.uuid ? mediaChoice.uuid : "",
      })();
    },
    [mediaChoice, handleInputData, name, id, type, setPreviewMedia]
  );

  const deleteMedia = (uuid: string) => (e: any) => {
    if (uuid)
      ServerHandler({
        method: "delete",
        endpoint: `/auth/media/${type}s/${uuid}/delete`,
      }).then((res) => {
        //console.log("res delete", res);
        toast(res.statusText);
        let identifyMediaInLib: HTMLElement | null =
          e.target.parentNode.parentNode.parentNode;
        if (identifyMediaInLib) {
          if (identifyMediaInLib.parentNode?.childNodes.length === 1)
            setPreviewMedia(null);
          identifyMediaInLib.remove();
        }
        if (mediaChoice && mediaChoice.uuid === uuid) setMediaChoice(null);
        if (previewMedia.uuid === uuid) setPreviewMedia(null);
      });
  };

  return library && !library[type] ? (
    <Loading animation="throbber" />
  ) : library && library[type] && library[type].length > 0 ? (
    <>
      <div className="w-full grid grid-cols-4">
        {library[type].map((media: any) => {
          return (
            <span key={media.uuid} className="media-ui-library">
              <label htmlFor={media.uuid}>
                {type === "video" ? (
                  <Video
                    src={media.path ? media.path : ""}
                    alt={media.title}
                    display="overlay"
                    //entityUrl={media.alias}
                  />
                ) : (
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
                )}
              </label>
              <input
                id={media.uuid}
                type="radio"
                //value="Select"
                name="media"
                onClick={() => setMediaChoice(media)}
                defaultChecked={
                  formData &&
                  formData.has(name) &&
                  formData.get(name) === media.uuid
                    ? true
                    : false
                }
              />
              {media && media.uuid ? (
                <span className="jsstyler toggle">
                  <input
                    id={"delete-media-" + media.uuid}
                    className="delete-overlay"
                    type="button"
                    value="Delete"
                    onClick={jsStyler()}
                  />
                  <div data-jsstyler-target={"delete-media-" + media.uuid}>
                    <input
                      className="delete-media-confirm"
                      type="button"
                      value="Confirm Delete"
                      onClick={(e) => deleteMedia(media.uuid)(e)}
                    />
                  </div>
                </span>
              ) : null}
            </span>
          );
        })}
      </div>

      <input
        id="media-ui-select-button"
        type="submit"
        value="Select"
        //name={name}
        disabled={mediaChoice && mediaChoice.uuid ? false : true}
        onClick={onSelect}
      />
    </>
  ) : (
    <Loading
      animation="throbber"
      message={
        type === "video"
          ? "No video found in library"
          : "No image found in library"
      }
    />
  );
};

const MediaUpload = ({
  setPreviewMedia,
  handleInputData,
  name,
  id,
  type,
}: any) => {
  console.log("type", type);
  const uploadAction = (res: any) => {
    if (res && res.data && res.data.path)
      setPreviewMedia({
        path:
          type === "video"
            ? res.data.source === "hosted"
              ? APP_ADDRESS + "/" + res.data.path
              : res.data.path
            : APP_ADDRESS + "/" + res.data.styles.small,
        mediaTitle: res.data.title,
        uuid: res.data.uuid,
      });
    handleInputData({
      name: name,
      id: id,
      type: type === "video" ? "video" : "image",
      value: res && res.data && res.data.uuid ? res.data.uuid : "",
    })();
  };
  return (
    <FileUploadUi
      nested={true}
      type={type === "video" ? "video" : "image"}
      callback={(res: any) => uploadAction(res)}
    />
  );
};

/* const VideoRemoteAdd = ({ setPreviewVideo, handleInputData, name, id }: any) => {
  const videoSources = [
    { key: "youtube", value: "YouTube Video" },
    { key: "vimeo", value: "Vimeo Video" },
  ];
  let videoFields = [
    {
      type: "select",
      weight: 0,
      label: "Video platform",
      id: "source",
      required: true,
      options:videoSources
    },
    {
      type: "text",
      weight: 1,
      id: "title",
      label: "Title",
      required: true,
    },
    {
      type: "boolean",
      weight: 2,
      id: "autoAlias",
      label: "Auto Alias",
      defaultValue: true,
      //options: ["truee", "falsee"],
    },
    {
      type: "text",
      weight: 5,
      id: "alias",
      label: "Alias",
      dependent: {
        id: "autoAlias",
        value: true,
        attribute: ["!visible", "empty"], //required/visible/checked/empty/select
      },
    },
  ];

  const addAction = (data: FormData) => async (e: any) => {
    e.preventDefault();
    let response: null | { data: any; status: number } = await FormSubmit(
      {
        e: e,
        data: data,
        endpoint: "/auth/media/video/add-remote",
        header: {
          "content-type": "multipart/form-data",
        },
      }
    );
    console.log("returnValue", response);
    if (response && response.data && response.data.path)
      setPreviewVideo({
        path: response.data.source === "hosted"
        ? APP_ADDRESS + "/" + response.data.path
        : response.data.path,
        mediaTitle: response.data.title,
      });
    handleInputData({
      name: name,
      id: id,
      type: "video",
      value: response && response.data && response.data.uuid ? response.data.uuid : "",
    })();
  };
  return (
    <FormUi
      nested={true}
      id="video-ui-add-remote-url"
      fields={videoFields}
      buttons={[
        {
          value: "Add to Library",
          weight: 1,
          styling: "p-3 mx-auto",
          submit: true,
          action: addAction,
        },
      ]}
    />
  );
}; */
