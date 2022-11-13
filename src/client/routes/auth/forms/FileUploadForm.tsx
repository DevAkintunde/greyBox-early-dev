import React from "react";
import { FormUi } from "../../../global/FormUi copy";

const FileUploadForm = () => {
  let fields = [
    {
      type: "file",
      weight: 0,
      label: "file",
      id: "file",
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
  ];
  return (
    <div>
      <FormUi fields={fields} />
    </div>
  );
};

export default FileUploadForm;
