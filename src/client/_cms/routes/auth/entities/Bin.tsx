import React, { useEffect, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import PageTitle from "../../../regions/PageTitle";
import { ServerHandler } from "../../../global/functions/ServerHandler";
import Loading from "../../../utils/Loading";
import { dateFormatter } from "../../../global/functions/dateFormatter";
import { Image } from "../../../components/Image";

const Bin = () => {
  return (
    <Routes>
      <Route path="/" index element={<ViewBin />} />
    </Routes>
  );
};

//view all entities
const ViewBin = () => {
  const location = useLocation();
  const [entities, setEntities]: any = useState({});
  useEffect(() => {
    let isMounted = true;
    ServerHandler(location.pathname).then((res) => {
      console.log(res);
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

  const restore = (uuid: string) => {
    ServerHandler("/auth/bin/restore/page/" + uuid).then((res) => {
      console.log("res", res);
    });
  };
  const permanentlyDelete = (uuid: string) => {
    ServerHandler({
      endpoint: "/auth/bin/delete/page/" + uuid,
      method: "delete",
    }).then((res) => {
      console.log("res", res);
    });
  };

  return (
    <>
      <PageTitle title="Bin" />
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
                  <th>Restore</th>
                  <th>Perm Del</th>
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
                      <td className="table-cell">
                        <input
                          value={"Restore"}
                          type="button"
                          onClick={() => restore(entity.uuid)}
                        />
                      </td>
                      <td className="table-cell">
                        <input
                          value={"Perm Del"}
                          type="button"
                          onClick={() => permanentlyDelete(entity.uuid)}
                        />
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

export default Bin;
