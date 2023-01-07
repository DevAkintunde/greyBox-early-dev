import React, { useEffect, useState } from "react";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import PageTitle from "../../../regions/PageTitle";
import { UpdateEntityAlias } from "../../../../_cms/components/auth/functionComponents/UpdateEntityAlias";
import { UpdateEntityStatus } from "../../../../_cms/components/auth/functionComponents/UpdateEntityStatus";
import { DeleteEntity } from "../../../../_cms/components/auth/functionComponents/DeleteEntity";
import { ServerHandler } from "../../../../_cms/global/functions/ServerHandler";
import { Image } from "../../../../_cms/components/Image";
import { dateFormatter } from "../../../../_cms/global/functions/dateFormatter";
import Loading from "../../../utils/Loading";
import { EntityForm } from "../../../../_cms/components/forms/auth/EntityForm";

//view all service contents
const Services = () => {
  return (
    <Routes>
      <Route path="/" index element={<ViewAllServices />} />
      <Route path="create" element={<CreateService />} />
      <Route path=":service" element={<ViewService />} />
      <Route path=":service/update" element={<PerServiceUpdate />} />
      <Route path=":service/update/alias" element={<UpdateEntityAlias />} />
      <Route path=":service/update/status" element={<UpdateEntityStatus />} />
      <Route
        path=":service/delete"
        element={
          <DeleteEntity
            toastText="Service content deleted"
            destination="/admin/auth/service"
          />
        }
      />
    </Routes>
  );
};

const ViewAllServices = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [entities, setEntities]: any = useState({});
  const [notOkResponse, setNotOkResponse] = useState();
  useEffect(() => {
    let isMounted = true;
    ServerHandler(location.pathname.split('/admin')[1]).then((res) => {
      if (isMounted && res) {
        if (res.status === 200) {
          setEntities(res.data);
        } else if (res.status === 404) {
          navigate("/404");
        } else {
          setNotOkResponse(res.statusText);
        }
      } else {
        navigate("/404");
      }
    });
    return () => {
      isMounted = false;
    };
  }, [location.pathname, navigate]);

  return (
    <>
      <PageTitle title="Services" />
      {entities && entities.service ? (
        <div>
          {entities.service && entities.service.length > 0 ? (
            <table className="table">
              <thead className="table-header-group">
                <tr className="table-row">
                  <th></th>
                  <th></th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>State</th>
                  <th>Created</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {entities.service.map((entity: any, index: number) => {
                  return (
                    <tr key={entity.uuid} className="table-row">
                      <td className="table-cell">{index + 1}</td>
                      <td className="table-cell">
                        <Link to={entity.alias}>
                          <Image
                            src={entity.featuredImage}
                            alt={entity.title}
                          />
                        </Link>
                      </td>
                      <td className="table-cell">
                        <Link to={entity.alias}>{entity.title}</Link>
                      </td>
                      <td className="table-cell">{entity.author}</td>
                      <td className="table-cell">{entity.status}</td>
                      <td className="table-cell">
                        {entity.state ? "Published" : "Unpublished"}
                      </td>
                      <td className="table-cell">
                        {dateFormatter({
                          date: entity.created,
                          format: "timeago",
                        })}
                      </td>
                      <td className="table-cell">
                        {entity.created !== entity.updated
                          ? dateFormatter({
                            date: entity.updated,
                            format: "timeago",
                          })
                          : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div>Service content yet to be created!</div>
          )}
        </div>
      ) : (
        <Loading
          message={notOkResponse}
          infinitylyLoad={notOkResponse ? true : false}
        />
      )}
    </>
  );
};

const CreateService = () => {
  const navigate = useNavigate();
  const callbackAction = (res: any) => {
    //console.log("creation", res);
    navigate("/admin/auth/service/" + res.data.alias);
  };

  return (
    <>
      <PageTitle title="Create an service" />
      <EntityForm
        //updateForm={true}
        id={"serviceCreationForm"}
        callback={(res: any) => callbackAction(res)}
      //setTitle={true}
      />
    </>
  );
};
const ViewService = () => {
  let location = useLocation();
  const navigate = useNavigate();
  const [notOkResponse, setNotOkResponse] = useState();

  const [entity, setEntity]: any = useState();
  useEffect(() => {
    let isMounted = true;
    ServerHandler(location.pathname.split('/admin')[1]).then((res) => {
      if (isMounted && res) {
        if (res.status === 200) {
          setEntity(res.data);
        } else if (res.status === 404) {
          navigate("/404");
        } else {
          setNotOkResponse(res.statusText);
        }
      } else {
        navigate("/404");
      }
    });
    return () => {
      isMounted = false;
    };
  }, [location.pathname, navigate]);

  return entity ? (
    <>
      {entity && entity.uuid ? (
        <>
          <PageTitle title={entity.title} />
          <div>{entity.alias}</div>
        </>
      ) : (
        <Loading
          message={notOkResponse}
          infinitylyLoad={notOkResponse ? true : false}
        />
      )}
    </>
  ) : (
    <Loading infinitylyLoad={true} />
  );
};

const PerServiceUpdate = () => {
  const navigate = useNavigate();

  const callbackAction = (res: any) => {
    navigate("/admin/auth/service/" + res.data.alias);
  };

  return (
    <>
      <EntityForm
        updateForm={true}
        id={"service-update-form"}
        callback={(res: any) => callbackAction(res)}
        setTitle={true}
      />
    </>
  );
};

export default Services;
