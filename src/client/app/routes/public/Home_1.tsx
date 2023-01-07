import { useState } from "react";
import { Previewer } from "../../components/frontpage/Previewer";
import temp from "../../../../assets/temp.jpg";
import lens from "../../../../assets/lens.png";
import { PhotographyBlock } from "../../components/frontpage/PhotographyBlock";
import { StoryDevBlock } from "../../components/frontpage/StoryDevBlock";
import { MotionGraphicsBlock } from "../../components/frontpage/MotionGraphicsBlock";
import { WebDesignBlock } from "../../components/frontpage/WebDesignBlock";

export const Home = () => {
  const [preview, setPreview] = useState("");

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full items-center">
        <div className="text-center">
          <div className="text-4xl pod:text-6xl sm:text-7xl md:text-8xl">
            Ideas
          </div>
          <div className="text-xl md:text-2xl">into</div>
          <div className="text-4xl pod:text-6xl sm:text-7xl md:text-8xl">
            Expression
          </div>
          <div className="text-xl md:text-2xl">into</div>
          <div className="text-4xl pod:text-6xl sm:text-7xl md:text-8xl">
            Experience
          </div>
        </div>
        <div>Services slideshow</div>
      </div>
      <div>
        <div>Clients</div>
        <div>Projects</div>
      </div>
    </>
  );
};
