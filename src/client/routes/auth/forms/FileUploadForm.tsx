import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FormUi } from "../../../global/FormUi";
import { ServerHandler } from "../../../global/functions/ServerHandler";

interface ComponentData {
  type: string;
  updateForm?: boolean;
}
const FileUploadForm = ({ type, updateForm }: ComponentData) => {
  const navigate = useNavigate();
  let location = useLocation();
  //fields
  const [fields, setFields]: any = useState([
    {
      type: "file",
      weight: 0,
      label: "Media",
      id: "path",
      /* extraElement: profile.avatar ? (
        <input value="Remove" onClick={removeAvatar} type="button" />
      ) : null, */
    },
    {
      type: "text",
      weight: 1,
      id: "title",
      label: "Title",
    },
  ]);
  console.log(location);
  let isUpdateForm = updateForm ? location.pathname.split("/update")[0] : "";
  //update form resolver
  useEffect(() => {
    if (isUpdateForm)
      ServerHandler({
        endpoint: isUpdateForm,
        method: "get",
        headers: {
          accept: "application/json",
        },
      }).then((res) => {
        if (res.status === 200) {
          setFields((prev: any) =>
            prev.map((field: any) => {
              console.log("field", field);
              return res.data && res.data[field.id]
                ? {
                    ...field,
                    defaultValue: res.data[field.id],
                  }
                : field;
            })
          );
        }
      });
    return () => {};
  }, [isUpdateForm]);

  const doUpload = (data: FormData) => (e: any) => {
    e.preventDefault();
    e.target.disabled = true;
    console.log("data", data);
    for (let [key, val] of data.entries()) {
      console.log("fetchForm", [key, val]);
    }
    if (e.target.classList && !e.target.classList.contains("bounce"))
      e.target.classList.add("bounce");

    data.append("public", "true");
    ServerHandler({
      endpoint: `/auth/media/${type}s/upload`,
      method: "post",
      headers: {
        accept: "application/json",
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

  let buttons = [
    {
      value: "Upload",
      weight: 1,
      styling: "p-3 mx-auto",
      submit: true,
      action: doUpload,
    },
  ];

  return (
    <div>
      <FormUi id={type + "-upload-form"} fields={fields} buttons={buttons} />
    </div>
  );
};

export default FileUploadForm;
