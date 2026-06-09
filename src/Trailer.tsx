import { AbsoluteFill, Solid } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { zoomThrough } from "./transitions/zoomThrough";
import { Scene1Intro } from "./scenes/Scene1Intro";
import { SceneBikePick } from "./scenes/SceneBikePick";
import { Scene2Select } from "./scenes/Scene2Select";
import { SceneColorScroll } from "./scenes/SceneColorScroll";
import { Scene3Result } from "./scenes/Scene3Result";
import { SceneResultsFan } from "./scenes/SceneResultsFan";
import { Scene4Deck } from "./scenes/Scene4Deck";
import { Scene5Device } from "./scenes/Scene5Device";
import { Scene6Outro } from "./scenes/Scene6Outro";

const timing = () => springTiming({ config: { damping: 200 }, durationInFrames: 24 });

export const Trailer: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: "#0F1923" }}>

            <TransitionSeries>
                <TransitionSeries.Sequence durationInFrames={90}>
                    <Scene1Intro />
                </TransitionSeries.Sequence>
                <TransitionSeries.Transition presentation={zoomThrough()} timing={timing()} />

                <TransitionSeries.Sequence durationInFrames={192}>
                    <SceneBikePick />
                </TransitionSeries.Sequence>
                <TransitionSeries.Transition presentation={zoomThrough()} timing={timing()} />

                <TransitionSeries.Sequence durationInFrames={90}>
                    <Scene2Select />
                </TransitionSeries.Sequence>
                <TransitionSeries.Transition presentation={zoomThrough()} timing={timing()} />

                <TransitionSeries.Sequence durationInFrames={126}>
                    <SceneColorScroll />
                </TransitionSeries.Sequence>
                <TransitionSeries.Transition presentation={zoomThrough()} timing={timing()} />

                <TransitionSeries.Sequence durationInFrames={90}>
                    <Scene3Result />
                </TransitionSeries.Sequence>
                <TransitionSeries.Transition presentation={zoomThrough()} timing={timing()} />

                <TransitionSeries.Sequence durationInFrames={66}>
                    <SceneResultsFan />
                </TransitionSeries.Sequence>
                {/* <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 24 })} /> */}

                <TransitionSeries.Sequence durationInFrames={93}>
                    <Scene4Deck />
                </TransitionSeries.Sequence>
                <TransitionSeries.Transition presentation={zoomThrough()} timing={timing()} />

                <TransitionSeries.Sequence durationInFrames={90}>
                    <Scene5Device />
                </TransitionSeries.Sequence>
                <TransitionSeries.Transition presentation={zoomThrough()} timing={timing()} />

                <TransitionSeries.Sequence durationInFrames={244}>
                    <Scene6Outro />
                </TransitionSeries.Sequence>
            </TransitionSeries>

            <Solid
                width={1080}
                height={1920}
                style={{
                    position: "absolute"
                }} /></AbsoluteFill>
    );
};