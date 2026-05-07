import { registerRoot } from "remotion";
import { Composition } from "remotion";
import { Main } from "./Main"; // 👈 seu vídeo novo

const RemotionRoot = () => {
  return (
    <Composition
      id="ZenithVideo"
      component={Main}
      durationInFrames={950}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};

registerRoot(RemotionRoot);