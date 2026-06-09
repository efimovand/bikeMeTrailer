import { Composition } from "remotion";
import { Trailer } from './Trailer';


export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Trailer"
      component={Trailer}
      durationInFrames={913}   // Σ сцен(1081) − Σ переходов(7×24=168); SceneColorScroll=126, Scene6Outro=244 (+39 ≈1.3с холд)
      fps={30}
      width={1080}
      height={1920}            // вертикаль 9:16 под IG/бота
    />
  );
};
