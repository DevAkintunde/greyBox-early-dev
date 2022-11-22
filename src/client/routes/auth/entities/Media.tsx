import React, { useContext, useEffect, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import PageTitle from "../../../components/blocks/PageTitle";
import { Throbber } from "../../../components/blocks/Throbber";
import { Image } from "../../../components/Image";
import { TabMenu } from "../../../global/AppFrame";
import { FormUi } from "../../../global/UI/FormUi";
import { ServerHandler } from "../../../global/functions/ServerHandler";
import FileUploadForm from "../../../components/auth/form/FileUploadForm";

//view all page entities

const Media = () => {
  return (
    <Routes>
      <Route path="/" index element={<ViewAllMedia />} />
      <Route path="add" element={<AddMedia />} />
      <Route path="add/image" element={<AddImage />} />
      <Route path="add/video" element={<AddVideo />} />
      <Route path="images" element={<ViewAllImages />} />
      <Route path="videos" element={<ViewAllVideos />} />
      <Route path="images/:media" element={<ViewImage />} />
      <Route path="videos/:media" element={<ViewVideo />} />
      <Route path="images/:media/update" element={<PerImageUpdate />} />
      <Route path="videos/:media/update" element={<PerVideoUpdate />} />
    </Routes>
  );
};

const AddMedia = () => {
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
  useEffect(() => {
    let isMounted = true;
    ServerHandler({
      endpoint: "/auth/media/images",
      method: "get",
      headers: {
        accept: "application/json",
      },
    }).then((res) => {
      console.log("res", res);
    });
    return () => {
      isMounted = false;
    };
  }, []);
  return <></>;
};

const ViewAllImages = () => {
  const [entities, setEntities]: any = useState();
  useEffect(() => {
    let isMounted = true;
    ServerHandler({
      endpoint: "/auth/media/images",
      method: "get",
      headers: {
        accept: "application/json",
      },
    }).then((res) => {
      if (isMounted && res.status === 200) setEntities(res.data.image);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <PageTitle title="Images" />
      {entities ? (
        <>
          <div className="grid grid-cols-4">
            {entities.map((entity: any) => {
              return (
                <Image
                  src={entity.path}
                  alt={entity.title}
                  entityUrl={entity.alias}
                />
              );
            })}
          </div>
        </>
      ) : (
        <Throbber />
      )}
    </>
  );
};
const ViewAllVideos = () => {
  return <></>;
};

const AddImage = () => {
  return <FileUploadForm type="image" />;
};

const ViewImage = () => {
  const { setTab }: any = useContext(TabMenu);
  let location = useLocation();

  useEffect(() => {
    let isMounted = true;
    if (isMounted) setTab({ Edit: location.pathname + "/update" });
    return () => {
      isMounted = false;
    };
  }, [location.pathname, setTab]);

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
      <Image src={entity.path} alt={entity.title} />
    </>
  ) : null;
};

const PerImageUpdate = () => {
  const { setTab }: any = useContext(TabMenu);
  let location = useLocation();

  useEffect(() => {
    let isMounted = true;
    if (isMounted) setTab({ View: location.pathname.split("/update")[0] });
    return () => {
      isMounted = false;
    };
  }, [location.pathname, setTab]);

  return <FileUploadForm type="image" updateForm={true} />;
};

const AddVideo = () => {
  return <FileUploadForm type="video" />;
};
const ViewVideo = () => {
  return <></>;
};
const PerVideoUpdate = () => {
  return <FileUploadForm type="video" />;
};

export default Media;
