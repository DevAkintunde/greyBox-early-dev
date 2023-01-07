import React, { useEffect, useState } from "react";
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import PageTitle from "../../../regions/PageTitle";
import { ServerHandler } from "../../../global/functions/ServerHandler";
import Loading from "../../../utils/Loading";
import { dateFormatter } from "../../../global/functions/dateFormatter";
import { Image } from "../../../components/Image";
import { toast } from "react-toastify";

const Bin = () => {
  return (
    <Routes>
      <Route path="/" index element={<ViewBin />} />
      <Route path=":node/:alias/delete" element={<PermanentDelete />} />
    </Routes>
  );
};

//view all entities
const ViewBin = () => {
  const location = useLocation();
  const [entities, setEntities]: any = useState();
  const [noResposeText, setNoResposeText] = useState("");
  const [reloadBin, setReloadBin] = useState("");
  useEffect(() => {
    let isMounted = true;
    ServerHandler(location.pathname.split("/admin")[1]).then((res) => {
      //console.log(res);
      if (res.status !== 200) {
        setNoResposeText(res.statusText);
      } else {
        let thisBin: object[] = [];
        Object.keys(res.data).forEach((nodeGroup) => {
          res.data[nodeGroup].forEach((node: object) => {
            thisBin.push({ ...node, type: nodeGroup });
          });
        });
        if (isMounted) setEntities(thisBin);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [location.pathname, reloadBin]);

  const restore = (type: string, alias: string) => {
    ServerHandler(`/auth/bin/${type}/${alias}/restore`).then((res) => {
      if (res.status !== 200) {
        toast(res.statusText);
      } else {
        setReloadBin(Date.now().toString());
      }
    });
  };

  //console.log("entities", entities);
  return (
    <>
      <PageTitle title="Bin" />
      {entities ? (
        <div>
          {entities.length > 0 ? (
            <table className="table">
              <thead className="table-header-group">
                <tr className="table-row">
                  <th></th>
                  <th>Type</th>
                  <th></th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>State</th>
                  <th>Created</th>
                  <th>Updated</th>
                  <th />
                  <th>Perm. Del</th>
                </tr>
              </thead>
              <tbody>
                {entities.map((entity: any, index: number) => {
                  return (
                    <tr key={entity.uuid} className="table-row">
                      <td className="table-cell">{index + 1}</td>
                      <td className="table-cell capitalize">{entity.type}</td>
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
                          className="button-pri"
                          onClick={() => restore(entity.type, entity.alias)}
                        />
                      </td>
                      <td className="table-cell">
                        <Link
                          to={`${entity.type}/${entity.alias}/delete`}
                          className="button-sec"
                        >
                          Delete
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <Loading message="No content in bin!" />
          )}
        </div>
      ) : (
        <Loading message={noResposeText ? noResposeText : ""} />
      )}
    </>
  );
};

export default Bin;

const PermanentDelete = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const doDelete = (e: any) => {
    e.preventDefault();
    e.target.disabled = true;
    if (e.target.classList && !e.target.classList.contains("bounce"))
      e.target.classList.add("bounce");

    ServerHandler({
      endpoint: location.pathname.split("/admin")[1],
      method: "delete",
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
        toast("Item deleted");
        navigate("/admin/auth/bin");
      }
    });
  };
  const backAway = () => {
    navigate("/admin/auth/bin");
  };

  return (
    <div className="text-center p-5">
      <div>Confirm you want to permanently delete this item?</div>
      <div>
        <input
          className={"form-button button-pri"}
          type="button"
          value="Back to bin"
          onClick={backAway}
        />
        <input
          className={"form-button submit button-sec"}
          type="submit"
          value="Delete Now"
          onClick={doDelete}
        />
      </div>
    </div>
  );
};
