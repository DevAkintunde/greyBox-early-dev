import React, { useEffect, useState } from "react";
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import PageTitle from "../../../regions/PageTitle";
import { Image } from "../../../components/Image";
import { ServerHandler } from "../../../global/functions/ServerHandler";
import { Video } from "../../../components/Video";
import { FormUi } from "../../../global/UI/formUI/FormUi";
import { DeleteEntity } from "../../../components/auth/functionComponents/DeleteEntity";
import Loading from "../../../utils/Loading";
import FileUploadUi from "../../../global/UI/formUI/FileUploadUi";

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
      <Route
        path="images/:media/update/alias"
        element={<PerMediaAliasUpdate type="image" />}
      />
      <Route
        path="videos/:media/update/alias"
        element={<PerMediaAliasUpdate type="video" />}
      />
      <Route path=":type/:media/delete" element={<PerMediaDelete />} />
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
      console.log(res);
      if (res.status !== 200) {
        //setEntities([res.statusText]);
      } else {
        if (isMounted) setEntities(res.data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  console.log("entities", entities);
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
          ) : (
            <div className="text-center">
              <span>There are currently no image uploaded.</span>
              <Link to={"/admin/auth/media/add/image"} className="button-pri">
                Add new image
              </Link>
            </div>
          )}
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
          ) : (
            <div className="text-center">
              <span>There are currently no video uploaded.</span>
              <Link to={"/admin/auth/media/add/video"} className="button-pri">
                Add new video
              </Link>
            </div>
          )}
        </div>
      ) : null}
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
      if (res.status !== 200) {
        console.log(res);
        //setEntities([res.statusText]);
      } else {
        if (isMounted && res.data[type]) {
          setEntities(res.data[type]);
        } else {
          setEntities([]);
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, [type]);

  //console.log(entities);
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
                    key={entity.alias}
                    src={entity.path}
                    alt={entity.title}
                    entityUrl={entity.alias}
                  />
                ) : (
                  <Video
                    key={entity.alias}
                    src={entity.path}
                    alt={entity.title}
                    entityUrl={entity.alias}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center">
              <div>{`No ${type} media files`}</div>
              <Link to={"/admin/auth/media/add/" + type} className="button-pri">
                Add new
              </Link>
            </div>
          )}
        </>
      ) : (
        <Loading animation="throbber" infinitylyLoad={true} />
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
    <>
      <PageTitle title={`Add new ${type}`} />
      <FileUploadUi type={type} callback={(res: any) => callbackAction(res)} />
    </>
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
        <Image
          src={entity.path}
          alt={entity.title} //entityUrl={entity.alias}
        />
      ) : (
        <Video
          src={entity.path}
          alt={entity.title} //entityUrl={entity.alias}
        />
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
    <>
      <FileUploadUi
        type={type}
        updateForm={true}
        callback={(res: any) => callbackAction(res)}
        setTitle={true}
      />
    </>
  );
};

const PerMediaAliasUpdate = ({ type }: { type: string }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const doUpdate = (data: FormData) => (e: any) => {
    e.preventDefault();
    e.target.disabled = true;
    if (e.target.classList && !e.target.classList.contains("bounce"))
      e.target.classList.add("bounce");

    ServerHandler({
      endpoint: location.pathname.split("/admin")[1],
      method: "patch",
      headers: {
        "content-type": "multipart/form-data",
      },
      body: data,
    }).then((res) => {
      console.log("res", res);
      if (res.status !== 200) {
        let submitNotice = document.getElementById("form-actions-notice");
        if (submitNotice)
          submitNotice.textContent = res.statusText
            ? res.statusText
            : "Oops! There was a problem somewhere. Please try again";
        let button: any = document.querySelector("input.submit");
        if (button) {
          if (button.classList && button.classList.contains("bounce"))
            button.classList.remove("bounce");
          /* if (button["disabled"] && button["disabled"] === true)
            button["disabled"] = false; */
        }
      } else {
        navigate("/auth/media/" + type + "s/" + res.data.alias);
      }
    });
  };

  const fields = [
    {
      type: "text",
      id: "alias",
      label: "Alias",
    },
  ];
  let buttons = [
    {
      value: "Update",
      weight: 1,
      styling: "p-3 mx-auto",
      submit: true,
      action: doUpdate,
    },
  ];

  return (
    <>
      <FormUi
        id={type + "-media-alias-update-form"}
        fields={fields}
        buttons={buttons}
      />
    </>
  );
};

const PerMediaDelete = () => {
  const params = useParams();
  let type = params.type;
  return (
    <DeleteEntity
      destination={"/auth/media/" + type}
      toastText={type?.substring(0, type.length - 1) + " deleted"}
    />
  );
};

export default Media;
