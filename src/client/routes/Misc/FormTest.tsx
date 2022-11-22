import React, { useEffect, useState } from "react";
import { FormUi } from "../../global/UI/FormUi";

export const FormTest = () => {
  //testing paragraph fields
  let paragraphs = [
    {
      type: "image",
      weight: 2,
      title: "image test here",
      id: "para-image",
      /* extraElement: profile.avatar ? (
        <input value="Remove" onClick={removeAvatar} type="button" />
      ) : null, */
    },
    {
      type: "video",
      weight: 1,
      id: Math.random().toString(36).substring(2), //uuid from db when it's available
      title: "this is paragraph test title",
      //value: 'uuid',
      value: {
        title: "this is video title field",
        source: "youtube",
        path: "http://mellywood.com/strnage-capo",
      },
    },
    {
      type: "text",
      weight: 3,
      id: Math.random().toString(36).substring(2), //uuid from db when it's available
      value: "this is a test text field alone",
    },
  ];

  const statusOptions = [
    { key: "draft", value: "Draft" },
    { key: "in_review", value: "In Review" },
    { key: "published", value: "Published" },
    { key: "unpublished", value: "Unpublished" },
  ];

  let fields = [
    {
      type: "paragraph",
      weight: 2,
      id: "body",
      label: "Paragraph Testing UI",
      defaultValue: paragraphs,
    },
    {
      type: "text",
      weight: 0,
      container: "fromFields",
      label: "title",
      id: "title",
      required: true,
    },
    {
      type: "select",
      weight: 0,
      container: "fromFields",
      label: "state",
      id: "state",
      options: statusOptions,
      //options: services,
    },
    {
      type: "file",
      weight: 0,
      container: "fromFields",
      label: "Feature Image",
      id: "featuredImageUri",
    },
    {
      type: "text",
      weight: 0,
      container: "fromFields",
      label: "alias",
      id: "alias",
    },
    {
      type: "textarea",
      weight: 0,
      container: "fromFields",
      label: "Revision",
      id: "revisionNote",
    },
  ];

  const [data, setData]: any = useState();
  console.log("data", data);
  useEffect(() => {
    const thisForm = document.getElementById("form-ui");
    if (thisForm) {
      let fetchForm = new FormData();
      console.log("fetchForm", fetchForm);
      for (let [key, val] of fetchForm.entries()) {
        console.log("fetchForm", [key, val]);
      }
    }
  }, [data]);

  return (
    <FormUi
      id="test-form"
      //containers={containers}
      fields={fields}
      formData={(data: object) => setData(data)}
      //buttons={buttons}
      className="mx-10"
    />
  );
};
