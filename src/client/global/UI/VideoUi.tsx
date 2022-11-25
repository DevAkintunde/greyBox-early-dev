import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Video } from "../../components/Video";
import FileUploadForm from "../../components/auth/form/FileUploadForm";
import { APP_ADDRESS } from "../../utils/app.config";
import { ServerHandler } from "../functions/ServerHandler";
import { Throbber } from "../../components/blocks/Throbber";

export const VideoUi = ({
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
  const [previewVideo, setPreviewVideo]: any = useState(null);

  useEffect(() => {
    let isMounted = true;
    let defaultImported;
    if (typeof defaultValue === "string") {
      defaultImported = defaultValue;
    } else {
      defaultImported = defaultValue.uuid;
    }

    if (isMounted && defaultImported)
      ServerHandler("/auth/media/videos/" + defaultImported).then((res) => {
        console.log("res", res);
        if (res && res.status === 200) {
          if (res.data.source !== "hosted") {
            setPreviewVideo({
              path: res.data.path,
              mediaTitle: res.data.title,
            });
          } else {
            setPreviewVideo({
              path: APP_ADDRESS + "/" + res.data.path,
              mediaTitle: res.data.title,
            });
          }
        }
      });

    return () => {
      isMounted = false;
    };
  }, [defaultValue]);

  const [view, setView]: any = useState(
    <VideoPreview
      handleInputData={handleInputData}
      media={previewVideo ? previewVideo : null}
      name={name}
      id={id}
      defaultValue={defaultValue}
      setPreviewVideo={setPreviewVideo}
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
      />
    );
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted)
      setView(
        <VideoPreview
          handleInputData={handleInputData}
          media={previewVideo ? previewVideo : null}
          name={name}
          id={id}
          defaultValue={defaultValue}
          setPreviewVideo={setPreviewVideo}
        />
      );
    return () => {
      isMounted = false;
    };
  }, [defaultValue, handleInputData, id, name, previewVideo]);

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
        setPreviewVideo={setPreviewVideo}
      />
    );
  };

  return (
    <div id="video-ui">
      <div id="viewer">{view ? view : <Throbber />}</div>
      <div id="video-ui-buttons">
        <input
          type="button"
          value="Preview"
          onClick={() => switchToPreview(previewVideo)}
        />
        <input type="button" value="Upload" onClick={switchToUploadNew} />
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
}: {
  handleInputData: any;
  media: { path: string; mediaTitle?: string };
  name: string;
  id: string;
  defaultValue: { uuid: string; title?: string };
  setPreviewVideo?: any;
}) => {
  const videoRemover = () => {
    setPreviewVideo();
    handleInputData({
      name: name,
      id: id,
      type: "video",
      value: "",
    })();
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
    </>
  ) : (
    <span id={"video-previewer"}>Add an Video</span>
  );
};

const VideoLibrary = ({
  formData,
  name,
  id,
  setPreviewVideo,
  handleInputData,
}: {
  formData: FormData;
  name: string;
  id: string;
  setPreviewVideo: any;
  handleInputData: any;
}) => {
  const [library, setLibrary]: any = useState({});
  useEffect(() => {
    let isMounted = true;
    ServerHandler("/auth/media/videos").then((res) => {
      if (isMounted && res.status === 200) setLibrary(res.data);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const [videoChoice, setVideoChoice]: any = useState(null);

  //console.log("library", library);

  const onSelect = () => {
    if (videoChoice && videoChoice.uuid) {
      if (videoChoice.source !== "hosted") {
        setPreviewVideo({
          path: videoChoice.path,
          mediaTitle: videoChoice.title,
        });
      } else {
        setPreviewVideo({
          path: APP_ADDRESS + "/" + videoChoice.path,
          mediaTitle: videoChoice.title,
        });
      }
    } else {
      setPreviewVideo((prev: any) => prev);
    }
    handleInputData({
      name: name,
      id: id,
      type: "video",
      value: videoChoice && videoChoice.uuid ? videoChoice.uuid : "",
    })();
  };

  const deleteVideo = (uuid: string) => {
    if (uuid)
      ServerHandler({
        method: "delete",
        endpoint: "/auth/media/videos/delete/" + uuid,
      }).then((res) => {
        //console.log("res delete", res);
        toast(res.statusText);
        setPreviewVideo(null);
      });
  };

  return library && !library.video ? (
    <Throbber />
  ) : library && library.video && library.video.length > 0 ? (
    <>
      <div className="grid grid-cols-4">
        {library.video.map((media: any) => {
          return (
            <span key={media.uuid} className="video-ui-library">
              <label htmlFor={media.uuid}>
                <Video
                  src={media.styles.path.small}
                  alt={media.title}
                  display="overlay"
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
                <input
                  id="video-ui-library-delete-button"
                  type="button"
                  value="Delete"
                  onClick={() => deleteVideo(media.uuid)}
                />
              ) : null}
            </span>
          );
        })}
      </div>

      <input
        id="video-ui-select-button"
        type="button"
        value="Select"
        //name={name}
        onClick={onSelect}
      />
    </>
  ) : (
    <div>No video found in library</div>
  );
};

const VideoUpload = ({ setPreviewVideo, handleInputData, name, id }: any) => {
  const uploadAction = (res: any) => {
    //console.log("the", res);
    if (res && res.data && res.data.path)
      if (res.data.source !== "hosted") {
        setPreviewVideo({
          path: res.data.path,
          mediaTitle: res.data.title,
        });
      } else {
        setPreviewVideo({
          path: APP_ADDRESS + "/" + res.data.path,
          mediaTitle: res.data.title,
        });
      }

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
