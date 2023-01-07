import React, { useEffect, useState } from "react";
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import PageTitle from "../../../../regions/PageTitle";
import { ServerHandler } from "../../../../global/functions/ServerHandler";
import Loading from "../../../../utils/Loading";
import { dateFormatter } from "../../../../global/functions/dateFormatter";
import { Image } from "../../../../components/Image";
import { DeleteEntity } from "../../../../components/auth/functionComponents/DeleteEntity";
import { UpdateEntityAlias } from "../../../../components/auth/functionComponents/UpdateEntityAlias";
import { UpdateEntityStatus } from "../../../../components/auth/functionComponents/UpdateEntityStatus";
import { EntityForm } from "../../../../components/forms/auth/EntityForm";

//view all blog articles
const Blog = () => {
  return (
    <Routes>
      <Route path="/" index element={<ViewAllArticles />} />
      <Route path="create" element={<CreateArticle />} />
      <Route path=":article" element={<ViewArticle />} />
      <Route path=":article/update" element={<PerArticleUpdate />} />
      <Route path=":article/update/alias" element={<UpdateEntityAlias />} />
      <Route path=":article/update/status" element={<UpdateEntityStatus />} />
      <Route
        path=":article/delete"
        element={
          <DeleteEntity
            toastText="Article deleted from blog"
            destination="/admin/auth/blog"
          />
        }
      />
    </Routes>
  );
};

const ViewAllArticles = () => {
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
      <PageTitle title="Blog" />
      {entities && entities.blog ? (
        <div>
          {entities.blog && entities.blog.length > 0 ? (
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
                {entities.blog.map((entity: any, index: number) => {
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
            <div>Blog articles yet to be created!</div>
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

const CreateArticle = () => {
  const navigate = useNavigate();
  const callbackAction = (res: any) => {
    //console.log("creation", res);
    navigate("/admin/auth/blog/" + res.data.alias);
  };

  return (
    <>
      <PageTitle title="Create an article" />
      <EntityForm
        //updateForm={true}
        id={"blogArticleCreationForm"}
        callback={(res: any) => callbackAction(res)}
      //setTitle={true}
      />
    </>
  );
};
const ViewArticle = () => {
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

const PerArticleUpdate = () => {
  const navigate = useNavigate();

  const callbackAction = (res: any) => {
    navigate("/admin/auth/blog/" + res.data.alias);
  };

  return (
    <>
      <EntityForm
        updateForm={true}
        id={"blog-article-update-form"}
        callback={(res: any) => callbackAction(res)}
        setTitle={true}
      />
    </>
  );
};

export default Blog;
