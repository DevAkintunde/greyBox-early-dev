import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FormUi } from "../../../global/UI/formUI/FormUi";
import { ServerHandler } from "../../../global/functions/ServerHandler";
import PageTitle from "../../blocks/PageTitle";

interface ComponentData {
  type: string;
  updateForm?: boolean;
  callback: Function;
  nested?: boolean;
  setTitle?: boolean;
}
const FileUploadForm = ({
  type,
  nested,
  updateForm,
  callback,
  setTitle,
}: ComponentData) => {
  let location = useLocation();
  let isUpdateForm = updateForm ? location.pathname.split("/update")[0] : "";
  //fields
  const [fields, setFields]: any = useState();
  const [formPageTitle, setFormPageTitle]: any = useState();

  //update form resolver
  useEffect(() => {
    const formFields = [
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
        required: true,
      },
      {
        type: "boolean",
        weight: 2,
        id: "autoAlias",
        label: "Auto Alias",
        defaultValue: true,
        //options: ["truee", "falsee"],
      },
      {
        type: "text",
        weight: 5,
        id: "alias",
        label: "Alias",
        dependent: {
          id: "autoAlias",
          value: true,
          attribute: ["!visible", "empty"], //required/visible/checked/empty/select
        },
      },
    ];
    if (isUpdateForm) {
      ServerHandler({
        endpoint: isUpdateForm,
        method: "get",
        headers: {
          accept: "application/json",
        },
      }).then((res) => {
        if (res.status === 200) {
          let updatedFields = formFields.map((field: any) => {
            return res.data && res.data[field.id] !== undefined
              ? {
                  ...field,
                  defaultValue: res.data[field.id],
                }
              : field;
          });
          setFields(updatedFields);
          if (setTitle) setFormPageTitle("Update " + res.data.title);
        }
      });
    } else {
      setFields(formFields);
      if (setTitle) setFormPageTitle("Create new");
    }
    return () => {};
  }, [isUpdateForm, setTitle]);

  const doUpload = (data: FormData) => (e: any) => {
    e.preventDefault();
    e.target.disabled = true;
    //console.log("data", data);
    /* for (let [key, val] of data.entries()) {
      console.log("fetchForm", [key, val]);
    } */
    if (e.target.classList && !e.target.classList.contains("bounce"))
      e.target.classList.add("bounce");

    data.append("public", "true");
    ServerHandler({
      endpoint: updateForm
        ? isUpdateForm + "/update"
        : `/auth/media/${type}s/upload`,
      method: updateForm ? "patch" : "post",
      headers: {
        //accept: "application/json",
        "content-type": "multipart/form-data",
      },
      body: data,
    }).then((res) => {
      //console.log("res", res);
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
        callback(res);
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
    <>
      {setTitle ? <PageTitle title={formPageTitle} /> : null}
      <div>
        <FormUi
          nested={nested ? true : false}
          id={type + "-upload-form"}
          fields={fields}
          buttons={buttons}
        />
      </div>
    </>
  );
};

export default FileUploadForm;
