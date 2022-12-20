import { useEffect, useState } from "react";
import { Previewer } from "../../components/frontpage/Previewer";
import temp from "../../../../assets/temp.jpg";
import lens from "../../../../assets/lens.png";
import { ServerHandler } from "../../global/functions/ServerHandler";
import { PhotographyBlock } from "../../components/frontpage/PhotographyBlock";
import { StoryDevBlock } from "../../components/frontpage/StoryDevBlock";
import { MotionGraphicsBlock } from "../../components/frontpage/MotionGraphicsBlock";
import { WebDesignBlock } from "../../components/frontpage/WebDesignBlock";

export const Home = () => {
  const [preview, setPreview] = useState("");

  return (
    <>
      <div className="grid grid-cols-5 items-center relative bg-color-pri">
        <div className="bg-color-def col-span-3 pr-[17%]">
          <div className="w-[90%] mx-auto grid grid-cols-2 break-words">
            <section className="border-r-2 border-color-pri pr-4">
              <PhotographyBlock
                toPreview={(content: any) => setPreview(content)}
              />
              <StoryDevBlock
                toPreview={(content: any) => setPreview(content)}
              />
              <MotionGraphicsBlock
                toPreview={(content: any) => setPreview(content)}
              />
              <WebDesignBlock
                toPreview={(content: any) => setPreview(content)}
              />
            </section>
            <section></section>
          </div>
        </div>
        <div className="col-span-2 items-center flex">
          <img
            src={lens}
            alt="lens"
            className="w-[50%] -ml-[25%] border-8 border-color-ter/50 rounded-full"
          />
          <Previewer content={preview} />
        </div>
      </div>

      <img src={temp} alt="template" />
    </>
  );
};
