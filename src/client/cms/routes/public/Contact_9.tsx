import React from "react";
import { ContactForm } from "../../components/blocks/ContactForm";
import PageTitle from "../../components/blocks/PageTitle";

export const Contact = ({ className }: any) => {
  return (
    <div className={className}>
      <PageTitle title="Leave Us a Message" />
      <ContactForm />
    </div>
  );
};
