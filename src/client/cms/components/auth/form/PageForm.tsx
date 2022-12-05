import React, { useEffect, useState } from "react";
import { FormUi } from "../../../global/UI/formUI/FormUi";
import { ServerHandler } from "../../../global/functions/ServerHandler";
import { useLocation } from "react-router-dom";
import PageTitle from "../../blocks/PageTitle";

interface ComponentData {
  id: string;
  updateForm?: boolean;
  callback: Function;
  setTitle?: boolean;
}
export const PageForm = ({
  id,
  updateForm,
  callback,
  setTitle,
}: ComponentData) => {
  const [statusOptions, setStatusOptions] = useState();
  let location = useLocation();
  let formApiUrl = updateForm
    ? location.pathname
    : location.pathname.split("/update")[0];
  //fields
  const [fields, setFields]: any = useState();
  const [formPageTitle, setFormPageTitle]: any = useState();

  useEffect(() => {
    let isMounted = true;
    ServerHandler("/field/auth/statuses").then((res) => {
      if (res.status === 200 && isMounted) setStatusOptions(res.options);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const fromFields = {
    //type: null,
    weight: 1,
    //styling: '',
  };
  const paragraphContainer = {
    weight: 2,
    indent: 2,
    //styling: '',
  };
  const containers = {
    paragraphContainer: paragraphContainer,
    fromFields: fromFields,
  };

  /*  let paragraphs = [
    {
      type: "image",
      weight: 2,
      id: "31f2b002-efe0-4af1-8871-2a68449d27f1",
      //defaultValue: "31f2b002-efe0-4af1-8871-2a68449d27f1",
      defaultValue: {
        title: "image test here",
        uuid: "31f2b002-efe0-4af1-8871-2a68449d27f1",
      },
    },
    {
      type: "video",
      weight: 1,
      id: "45f2b002-efe0-4af1-8871-2a68449d27f1",
      defaultValue: {
        title: "this is video title field",
        source: "youtube",
        uuid: "45f2b002-efe0-4af1-8871-2a68449d27f1",
      },
    },
    {
      type: "text",
      weight: 3,
      //id: Math.random().toString(36).substring(2), //uuid from db when it's available
      id: "92f2b002-efe0-4af1-8871-2a68449d27f1",
      defaultValue: "this is a test text field alone",
    },
  ]; */

  //update form resolver
  useEffect(() => {
    const formFields = [
      {
        type: "image",
        weight: 0,
        container: "fromFields",
        label: "Featured Image",
        id: "featuredImage",
        /* defaultValue: {
        uuid: "31f2b002-efe0-4af1-8871-2a68449d27f1",
        title: "featured image title",
      }, */
        //defaultValue: "31f2b002-efe0-4af1-8871-2a68449d27f1",
      },
      {
        type: "text",
        weight: 0,
        container: "fromFields",
        label: "Title",
        id: "title",
        required: true,
      },
      {
        type: "radio",
        weight: 0,
        container: "fromFields",
        label: "Status",
        id: "status",
        options: statusOptions,
      },
      {
        type: "textarea",
        weight: 0,
        container: "fromFields",
        label: "summary",
        id: "summary",
      },
      {
        type: "textarea",
        weight: 0,
        container: "fromFields",
        label: "Revision",
        id: "revisionNote",
      },
      {
        type: "boolean",
        weight: 2,
        id: "autoAlias",
        label: "Auto Alias",
        defaultValue: true,
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
      {
        type: "paragraph",
        weight: 0,
        container: "fromFields",
        label: "Body",
        id: "body",
        //defaultValue: paragraphs,
      },
    ];
    if (updateForm) {
      ServerHandler({
        endpoint: location.pathname.split("/update")[0],
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
      if (setTitle) setFormPageTitle("Create a page");
    }
    return () => {};
  }, [formApiUrl, setTitle, statusOptions, updateForm]);

  const sendToServer = (data: FormData) => (e: any) => {
    e.preventDefault();
    e.target.disabled = true;
    console.log("data", data);
    for (let [key, val] of data.entries()) {
      console.log("fetchForm", [key, val]);
    }
    if (e.target.classList && !e.target.classList.contains("bounce"))
      e.target.classList.add("bounce");

    ServerHandler({
      endpoint: formApiUrl,
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
      action: sendToServer,
    },
  ];

  return (
    <>
      {setTitle ? <PageTitle title={formPageTitle} /> : null}
      <FormUi
        containers={containers}
        id={id}
        fields={fields}
        buttons={buttons}
      />
    </>
  );
};
