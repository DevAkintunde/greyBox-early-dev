import React, { useEffect, useState } from "react";
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import PageTitle from "../../../components/blocks/PageTitle";
import { Throbber } from "../../../components/blocks/Throbber";
import { Image } from "../../../components/Image";
import { ServerHandler } from "../../../global/functions/ServerHandler";
import FileUploadForm from "../../../components/auth/form/FileUploadForm";
import { Video } from "../../../components/Video";

//view all page entities

const Media = () => {
  return (
    <Routes>
      <Route path="/" index element={<ViewAllMedia />} />
      <Route path="add" element={<AddMediaOverview />} />
      <Route path="add/image" element={<AddMedia type="image" />} />
      <Route path="add/video" element={<AddMedia type="video" />} />
      <Route path="images" element={<ViewTypeMedia type="image" />} />
      <Route path="videos" element={<ViewTypeMedia type="video" />} />
      <Route path="images/:media" element={<ViewMedia type="image" />} />
      <Route path="videos/:media" element={<ViewMedia type="video" />} />
      <Route
        path="images/:media/update"
        element={<PerMediaUpdate type="image" />}
      />
      <Route
        path="videos/:media/update"
        element={<PerMediaUpdate type="video" />}
      />
    </Routes>
  );
};

const AddMediaOverview = () => {
  return (
    <>
      <PageTitle title="Add new media" />
      <div className="grid grid-flow-col gap-4 mx-auto text-4xl">
        <Link to="image" className="button-pri">
          Add Image
        </Link>
        <Link to="video" className="button-pri">
          Add Video
        </Link>
      </div>
    </>
  );
};

const ViewAllMedia = () => {
  const [entities, setEntities]: any = useState({});
  useEffect(() => {
    let isMounted = true;
    ServerHandler("/auth/media").then((res) => {
      console.log("res", res);
      if (res.status !== 200) {
        console.log(res);
        //setEntities([res.statusText]);
      } else {
        if (isMounted) setEntities(res.data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);
  return (
    <>
      <PageTitle title="Media" />
      {entities && (entities.image || entities.video) ? (
        <div>
          {entities.image && entities.image.length > 0 ? (
            <div>
              <h2>Images</h2>
              <div className="grid grid-cols-4">
                {entities.image.map((entity: any) => {
                  return (
                    <Image
                      key={entity.alias}
                      src={entity.path}
                      alt={entity.title}
                      entityUrl={"images/" + entity.alias}
                    />
                  );
                })}
              </div>
            </div>
          ) : null}
          {entities.video && entities.video.length > 0 ? (
            <div>
              <h2>Videos</h2>
              <div className="grid grid-cols-4">
                {entities.video.map((entity: any) => {
                  return (
                    <Video
                      key={entity.alias}
                      src={entity.path}
                      alt={entity.title}
                      entityUrl={"videos/" + entity.alias}
                    />
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}{" "}
    </>
  );
};

const ViewTypeMedia = ({ type }: { type: string }) => {
  const [entities, setEntities]: any = useState();
  useEffect(() => {
    let isMounted = true;
    ServerHandler({
      endpoint: "/auth/media/" + type + "s",
      method: "get",
      headers: {
        accept: "application/json",
      },
    }).then((res) => {
      console.log("res", res);
      if (res.status !== 200) {
        console.log(res);
        //setEntities([res.statusText]);
      } else {
        if (isMounted) setEntities(res.data[type]);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [type]);

  console.log(entities);
  return (
    <>
      <PageTitle title={type + "s"} />
      {entities ? (
        <>
          {entities.length !== 0 ? (
            <div className="grid grid-cols-4">
              {entities.map((entity: any) => {
                return type === "image" ? (
                  <Image
                    src={entity.path}
                    alt={entity.title}
                    entityUrl={entity.alias}
                  />
                ) : (
                  <Video
                    src={entity.path}
                    alt={entity.title}
                    entityUrl={entity.alias}
                  />
                );
              })}
            </div>
          ) : (
            <div>
              <div>No media file</div>
              <Link to="/auth/media/add">Create New</Link>
            </div>
          )}
        </>
      ) : (
        <Throbber />
      )}
    </>
  );
};

const AddMedia = ({ type }: { type: string }) => {
  const navigate = useNavigate();
  const callbackAction = (res: any) => {
    navigate("/auth/media/" + type + "s/" + res.data.alias);
  };
  return (
    <FileUploadForm type={type} callback={(res: any) => callbackAction(res)} />
  );
};

const ViewMedia = ({ type }: { type: string }) => {
  let location = useLocation();

  const [entity, setEntity]: any = useState();
  useEffect(() => {
    let isMounted = true;
    ServerHandler(location.pathname).then((res) => {
      console.log("res", res);
      if (isMounted && res.status === 200) setEntity(res.data);
    });
    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  return entity ? (
    <>
      <PageTitle title={entity.title} />
      {type === "image" ? (
        <Image src={entity.path} alt={entity.title} entityUrl={entity.alias} />
      ) : (
        <Video src={entity.path} alt={entity.title} entityUrl={entity.alias} />
      )}
    </>
  ) : null;
};

const PerMediaUpdate = ({ type }: { type: string }) => {
  const navigate = useNavigate();

  const callbackAction = (res: any) => {
    navigate("/auth/media/" + type + "s/" + res.data.alias);
  };

  return (
    <FileUploadForm
      type={type}
      updateForm={true}
      callback={(res: any) => callbackAction(res)}
    />
  );
};

export default Media;
