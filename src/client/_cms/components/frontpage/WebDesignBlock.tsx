import React from "react";
import { SlideShow } from "../SlideShow";

type ToPreview = (a: any) => void;
export const WebDesignBlock = (props: any) => {
  let toPreview: ToPreview = props.toPreview;
  const service = "Media website designs";

  const endpoint = "images&limit=4";

  const dummyD = ["hello1", "hello2", "hello3", "hello4"];

  return (
    <section className="w-3/4 ml-auto my-4">
      <SlideShow content={dummyD} navigator={true} />
      <div
        className="first-letter:text-5xl text-xl cursor-pointer"
        onClick={() => toPreview(endpoint)}
      >
        {service}
      </div>
    </section>
  );
};
