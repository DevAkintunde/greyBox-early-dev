interface ImportedFormFields {
  fields?: string[];
  filter: "full" | "basic" | undefined | null;
  custom?: {
    weight: number;
    type: string;
    container?: string;
    label: string;
    id: string;
    defaultValue?: string | object;
    options?: string[] | object[];
  }[];
}
export const FormFields = ({ fields, filter, custom }: ImportedFormFields) => {
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

  let formFields = {
    featuredImage: {
      type: "image",
      weight: 0,
      //container: "formField",
      label: "Featured Image",
      id: "featuredImage",
      /* defaultValue: {
                uuid: "31f2b002-efe0-4af1-8871-2a68449d27f1",
                title: "featured image title",
              }, */
      //defaultValue: "31f2b002-efe0-4af1-8871-2a68449d27f1",
    },
    title: {
      type: "text",
      weight: 1,
      //container: "formField",
      label: "Title",
      id: "title",
      required: true,
    },
    summary: {
      type: "textarea",
      weight: 3,
      //container: "formField",
      label: "summary",
      id: "summary",
    },
    revisionNote: {
      type: "textarea",
      weight: 4,
      //container: "formField",
      label: "Revision",
      id: "revisionNote",
    },
    autoAlias: {
      type: "boolean",
      weight: 5,
      id: "autoAlias",
      label: "Auto Alias",
      defaultValue: true,
    },
    alias: {
      type: "text",
      weight: 6,
      id: "alias",
      label: "Alias",
      dependent: {
        id: "autoAlias",
        value: true,
        attribute: ["!visible", "empty"], //required/visible/checked/empty/select
      },
    },
    body: {
      type: "paragraph",
      weight: 99,
      container: "paragraphContainer",
      label: "Body",
      id: "body",
      //defaultValue: paragraphs,
    },
  };

  let exportField: any[] = [];
  if (filter === "full") {
    exportField = Object.keys(formFields).map((field: string) => {
      return formFields[field as keyof typeof formFields];
    });
    if (custom && custom.length > 0) {
      custom.forEach((field) => {
        exportField.push(field);
      });
    }
    exportField.sort((a, b): any => a.weight - b.weight);
  } else if (filter === "basic") {
  }
  return exportField;
};
