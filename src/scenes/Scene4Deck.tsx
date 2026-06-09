import {
    AbsoluteFill, Img, staticFile, interpolate, spring,
    useCurrentFrame, useVideoConfig, Easing,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["300", "600"] });

const CARDS = ["1.jpg", "2.jpg", "9.jpg", "3.jpg"];
const CARD_W = 760, CARD_H = 860, GAP = 10;
const STEP = CARD_W + GAP;
const TOP = 380;

export const Scene4Deck: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    // +3: срезаем первые 3 статичных кадра — анимации стартуют сразу
    const f = frame + 3;

    const pos = interpolate(
        f,
        [0, 10, 20, 30, 40, 50, 60, 90],
        [0, 0, 1, 1, 2, 2, 3, 3],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) }
    );

    const rowX = (1080 / 2 - CARD_W / 2) - pos * STEP;
    const capOpacity = interpolate(f, [4, 20], [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

    return (
        <AbsoluteFill style={{ backgroundColor: "#0F1923", fontFamily }}>
            <div style={{ position: "absolute", top: TOP, left: rowX, height: CARD_H }}>
                {CARDS.map((src, i) => {
                    const d = Math.abs(i - pos);
                    const scale = interpolate(d, [0, 1], [1, 0.8], { extrapolateRight: "clamp" });
                    const opacity = interpolate(d, [0, 1, 1.6], [1, 0.45, 0.12], { extrapolateRight: "clamp" });
                    const bright = interpolate(d, [0, 1], [1, 0.6], { extrapolateRight: "clamp" });

                    // ★ reveal только для i===1
                    const revealSpring = i === 1 ? spring({
                        frame: f,
                        fps,
                        config: { damping: 22, stiffness: 120 },
                        durationInFrames: 20,
                    }) : 1;
                    const revealScale = interpolate(revealSpring, [0, 1], [0.82, 1]);
                    const revealOpacity = interpolate(revealSpring, [0, 0.3, 1], [0, 0, 1]);

                    return (
                        <div key={src} style={{
                            position: "absolute",
                            left: i * STEP,
                            top: 0,
                            width: CARD_W,
                            height: CARD_H,
                            borderRadius: 36,
                            overflow: "hidden",
                            transform: `scale(${scale * revealScale})`,
                            opacity: opacity * revealOpacity,
                            boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
                        }}>
                            <Img
                                src={staticFile(`generations/${src}`)}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                            <div style={{
                                position: "absolute", inset: 0, backgroundColor: "#0F1923",
                                opacity: 1 - bright,
                            }} />
                        </div>
                    );
                })}
            </div>

            <div style={{
                position: "absolute", top: TOP + CARD_H + 70, width: "100%", textAlign: "center",
                color: "#F0F4F8", fontWeight: 300, fontSize: 56, letterSpacing: -1, opacity: capOpacity,
            }}>Любой байк. Любой <span style={{ fontWeight: 600 }}>стиль.</span></div>
        </AbsoluteFill>
    );
};