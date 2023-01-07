import React from "react";
import PageTitle from "../../regions/PageTitle";
import { ContactForm } from "../../../_cms/components/forms/ContactForm";

export const Contact = ({ className }: any) => {
  return (
    <div className={className}>
      <PageTitle title="Leave Us a Message" />
      <ContactForm />
    </div>
  );
};
