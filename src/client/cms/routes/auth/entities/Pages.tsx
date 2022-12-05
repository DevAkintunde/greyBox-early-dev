import React, { useEffect, useState } from "react";
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { PageForm } from "../../../components/auth/form/PageForm";
import PageTitle from "../../../components/blocks/PageTitle";
import { ServerHandler } from "../../../global/functions/ServerHandler";
import Loading from "../../../utils/Loading";
import { dateFormatter } from "../../../global/functions/dateFormatter";
import { Image } from "../../../components/Image";

//view all page entities

const Pages = () => {
  return (
    <Routes>
      <Route path="/" index element={<ViewPages />} />
      <Route path="create" element={<CreatePage />} />
      <Route path=":page" element={<ViewPage />} />
      <Route path=":page/update" element={<PerPageUpdate />} />
      <Route path=":page/update/alias" element={<PerPageAliasUpdate />} />
      <Route path=":page/delete" element={<DeletePage />} />
    </Routes>
  );
};

const ViewPages = () => {
  const location = useLocation();
  const [entities, setEntities]: any = useState({});
  useEffect(() => {
    let isMounted = true;
    ServerHandler(location.pathname).then((res) => {
      //console.log("res", res);
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
  }, [location.pathname]);

  return (
    <>
      <PageTitle title="Pages" />
      {entities && entities.page ? (
        <div>
          {entities.page && entities.page.length > 0 ? (
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
                {entities.page.map((entity: any, index: number) => {
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
            <div>Page content yet to be created!</div>
          )}
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

const CreatePage = () => {
  const navigate = useNavigate();
  const callbackAction = (res: any) => {
    navigate("/auth/pages/" + res.data.alias);
  };

  return (
    <>
      <PageTitle title="Create a page" />
      <PageForm
        //updateForm={true}
        id={"pageCreationForm"}
        callback={(res: any) => callbackAction(res)}
        //setTitle={true}
      />
    </>
  );
};
const ViewPage = () => {
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
      <div>{entity.alias}</div>
    </>
  ) : null;
};

const PerPageUpdate = () => {
  const navigate = useNavigate();

  const callbackAction = (res: any) => {
    navigate("/auth/pages" + res.data.alias);
  };

  return (
    <>
      <PageForm
        updateForm={true}
        id={"page-update-form"}
        callback={(res: any) => callbackAction(res)}
        setTitle={true}
      />
    </>
  );
};

const PerPageAliasUpdate = () => {
  return <></>;
};
const DeletePage = () => {
  return <></>;
};

export default Pages;
