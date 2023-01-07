import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Video } from "../../../../components/Video";
import { APP_ADDRESS } from "../../../../utils/app.config";
import { ServerHandler } from "../../../functions/ServerHandler";
import Loading from "../../../../utils/Loading";
import { FormUi } from "../FormUi";
import { FormSubmit } from "../FormSubmit";
import { jsStyler } from "../../../functions/jsStyler";
import FileUploadForm from "../../../../components/auth/form/FileUploadForm";

export const VideoUi = ({
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
  const [previewVideo, setPreviewVideo]: any = useState(null);

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
        ServerHandler("/auth/media/videos/" + defaultImported).then((res) => {
          //console.log("res", res);
          if (res && res.status === 200)
            setPreviewVideo({
              path:
                res.data.source === "hosted"
                  ? APP_ADDRESS + "/" + res.data.path
                  : res.data.path,
              mediaTitle: res.data.title,
              uuid: defaultImported,
            });
        });
    }
    return () => {
      isMounted = false;
    };
  }, [defaultValue, uuidIdentifier]);

  // force remove previewImage attributes
  const [setPreviewToNull, setSetPreviewToNull]: [boolean, any] =
    useState(false);

  const [view, setView]: any = useState(
    <VideoPreview
      handleInputData={handleInputData}
      media={previewVideo ? previewVideo : null}
      name={name}
      id={id}
      defaultValue={defaultValue}
      setPreviewVideo={setPreviewVideo}
      titleField={titleField}
      setSetPreviewToNull={setSetPreviewToNull}
    />
  );

  const switchToPreview: any = (media: string | null) => {
    setView(
      <VideoPreview
        handleInputData={handleInputData}
        media={media ? media : previewVideo ? previewVideo : null}
        name={name}
        id={id}
        defaultValue={defaultValue}
        setPreviewVideo={setPreviewVideo}
        titleField={titleField}
        setSetPreviewToNull={setSetPreviewToNull}
      />
    );
  };

  useEffect(() => {
    let isMounted = true;
    if ((isMounted && previewVideo && previewVideo.path) || setPreviewToNull) {
      //clear forced null value of preview
      if (setPreviewToNull) {
        setSetPreviewToNull(false);
        setPreviewVideo(null);
      }
      setView(
        <VideoPreview
          handleInputData={handleInputData}
          media={setPreviewToNull ? null : previewVideo ? previewVideo : null}
          name={name}
          id={id}
          defaultValue={defaultValue}
          setPreviewVideo={setPreviewVideo}
          titleField={titleField}
          setSetPreviewToNull={setSetPreviewToNull}
        />
      );
    }
    return () => {
      isMounted = false;
    };
  }, [defaultValue, handleInputData, id, name, previewVideo, setPreviewToNull,titleField]);

  /* const switchToAddNewRemote = () => {
    setView(
      <VideoRemoteAdd
        name={name}
        setPreviewVideo={setPreviewVideo}
        handleInputData={handleInputData}
      />
    );
  }; */
  const switchToUploadNew = () => {
    setView(
      <VideoUpload
        name={name}
        setPreviewVideo={setPreviewVideo}
        handleInputData={handleInputData}
      />
    );
  };
  const switchToLibrary = () => {
    setView(
      <VideoLibrary
        name={name}
        id={id}
        formData={formData}
        handleInputData={handleInputData}
        previewVideo={previewVideo}
        setPreviewVideo={setPreviewVideo}
      />
    );
  };

  return (
    <div id="video-ui">
      <div id="viewer">{view ? view : <Loading animation="throbber" />}</div>
      <div id="video-ui-buttons">
        <input
          type="button"
          value="Preview"
          onClick={() => switchToPreview(previewVideo)}
        />
        <input type="button" value="Add New Video Url" onClick={switchToUploadNew} />
        {/* <input type="button" value="Upload" onClick={switchToUploadNew} /> */}
        <input type="button" value="Library" onClick={switchToLibrary} />
      </div>
    </div>
  );
};

const VideoPreview = ({
  handleInputData,
  media,
  name,
  id,
  defaultValue,
  setPreviewVideo,
  titleField,
  setSetPreviewToNull,
}: //uuidIdentifier,
{
  handleInputData: any;
  media: { path: string; mediaTitle?: string };
  name: string;
  id: string;
  defaultValue: { uuid: string; title?: string };
  setPreviewVideo?: any;
  titleField?: boolean;
  setSetPreviewToNull: any;
  //uuidIdentifier:string
}) => {
  const videoRemover = () => {
    handleInputData({
      name: name,
      id: id,
      type: "video",
      value: "",
    })();
    setSetPreviewToNull(true);
  };

  return media && handleInputData ? (
    <>
      <span className="video-previewer-container">
        <img
          id={"video-previewer"}
          src={media.path}
          alt="preview"
          style={{ width: "100px" }}
        />
        {media && media.mediaTitle ? (
          <div className={"video-previewer-title"}>{media.mediaTitle}</div>
        ) : null}
        <input
          id="video-selected-remover"
          type="button"
          value="X"
          onClick={videoRemover}
        />
      </span>
      {titleField ? (
        <div className="video-ui-title">
          <label htmlFor={id + "-video-title"}>Title|</label>
          <input
            type="text"
            id={id + "-video-title"}
            name={id + "[title]"}
            onChange={(e: any) => {
              handleInputData({
                name: id + "[title]",
                id: id,
                type: "video",
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
    <Loading instantMessage={true} message="Add an Video" />
    /* <span id={"video-previewer"}></span> */
  );
};

const VideoLibrary = ({
  formData,
  name,
  id,
  previewVideo,
  setPreviewVideo,
  handleInputData,
}: {
  formData: FormData;
  name: string;
  id: string;
  previewVideo: any;
  setPreviewVideo: any;
  handleInputData: any;
}) => {
  const [library, setLibrary]: any = useState({});
  useEffect(() => {
    let isMounted = true;
    ServerHandler("/auth/media/videos").then((res) => {
      setTimeout(() => {
        if (isMounted && res.status === 200) setLibrary(res.data);
      }, 2000);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const [videoChoice, setVideoChoice]: any = useState(null);

  //console.log("library", library);

  const onSelect = useCallback(
    (e: any) => {
      if (e) e.preventDefault();
    if (videoChoice && videoChoice.uuid) {
      setPreviewVideo({
        path: videoChoice.source === "hosted"
        ? APP_ADDRESS + "/" + videoChoice.path
        : videoChoice.path,
        mediaTitle: videoChoice.title,
        uuid: videoChoice.uuid,
      });
    } else {
      setPreviewVideo((prev: any) => prev);
    }
    handleInputData({
      name: name,
      id: id,
      type: "video",
      value: videoChoice && videoChoice.uuid ? videoChoice.uuid : "",
    })();
  },
  [handleInputData, id, name, setPreviewVideo, videoChoice]
);

const deleteImage = (uuid: string) => (e: any) => {
  if (uuid)
    ServerHandler({
      method: "delete",
      endpoint: `/auth/media/videos/${uuid}/delete`,
    }).then((res) => {
      //console.log("res delete", res);
      toast(res.statusText);
      let identifyImageInLib: HTMLElement | null =
        e.target.parentNode.parentNode.parentNode;
      if (identifyImageInLib) {
        if (identifyImageInLib.parentNode?.childNodes.length === 1)
          setPreviewVideo(null);
        identifyImageInLib.remove();
      }
      if (videoChoice && videoChoice.uuid === uuid) setVideoChoice(null);
      if (previewVideo.uuid === uuid) setPreviewVideo(null);
    });
};

  return library && !library.video ? (
    <Loading animation="throbber" />
  ) : library && library.video && library.video.length > 0 ? (
    <>
      <div className="w-full grid grid-cols-4">
        {library.video.map((media: any) => {
          return (
            <span key={media.uuid} className="video-ui-library">
              <label htmlFor={media.uuid}>
                <Video
                  src={
                    media.path
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
                onClick={() => setVideoChoice(media)}
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
                      onClick={(e) => deleteImage(media.uuid)(e)}
                    />
                  </div>
                </span>
              ) : null}
            </span>
          );
        })}
      </div>

      <input
        id="video-ui-select-button"
        type="submit"
        value="Select"
        //name={name}
        disabled={videoChoice && videoChoice.uuid?false:true}
        onClick={onSelect}
      />
    </>
  ) : (
    <Loading animation="throbber" message="No video found in library" />
  );
};

const VideoUpload = ({ setPreviewVideo, handleInputData, name, id }: any) => {
  const uploadAction = (res: any) => {
    //console.log("the", res);
    if (res && res.data && res.data.path)
      setPreviewVideo({
        path: res.data.source === "hosted"
        ? APP_ADDRESS + "/" + res.data.path
        : res.data.path,
        mediaTitle: res.data.title,
        uuid: res.data.uuid,
      });
    handleInputData({
      name: name,
      id: id,
      type: "video",
      value: res && res.data && res.data.uuid ? res.data.uuid : "",
    })();
  };
  return (
    <FileUploadForm
      nested={true}
      type="video"
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
