import {
    AbsoluteFill, Img, staticFile, interpolate, spring,
    useCurrentFrame, useVideoConfig, Easing,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["300", "500", "600"] });

const CARD_W = 900, CARD_H = 1000;
const CARD_LEFT = (1080 - CARD_W) / 2;
const CARD_TOP = 300;

export const Scene3Result: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const enter = spring({ frame, fps, config: { damping: 18, stiffness: 90 }, durationInFrames: 30 });
    const slideX = interpolate(enter, [0, 1], [460, 0]);
    const cardOpacity = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });

    const capOpacity = interpolate(frame, [28, 48], [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    const capY = interpolate(frame, [28, 48], [40, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    const chips = interpolate(frame, [6, 22], [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

    return (
        <AbsoluteFill style={{ backgroundColor: "#0F1923", fontFamily }}>
            <div style={{
                position: "absolute", top: 190, width: "100%", display: "flex",
                justifyContent: "center", gap: 18, opacity: chips,
                transform: `translateY(${(1 - chips) * 20}px)`,
            }}>
                {["Шлем", "Куртка"].map((t) => (
                    <div key={t} style={{
                        padding: "18px 34px", borderRadius: 999, background: "rgba(232,102,10,0.15)",
                        border: "2px solid #E8660A", color: "#F0F4F8", fontSize: 34, fontWeight: 500,
                        display: "inline-flex", alignItems: "center", lineHeight: 1,
                    }}>✓ {t}</div>
                ))}
            </div>

            <div style={{
                position: "absolute", left: CARD_LEFT, top: CARD_TOP, width: CARD_W, height: CARD_H,
                borderRadius: 40, overflow: "hidden", opacity: cardOpacity,
                transform: `translateX(${slideX}px)`, boxShadow: "0 40px 100px rgba(0,0,0,0.55)",
            }}>
                <Img src={staticFile("generations/20.png")} style={{
                    width: "100%", height: "100%", objectFit: "cover",
                }} />
            </div>

            <div style={{
                position: "absolute", top: CARD_TOP + CARD_H + 46, width: "100%", textAlign: "center",
                color: "#F0F4F8", fontWeight: 300, fontSize: 60, letterSpacing: -1,
                opacity: capOpacity, transform: `translateY(${capY}px)`,
            }}>Примерь <span style={{ fontWeight: 600 }}>на себя.</span></div>
        </AbsoluteFill>
    );
};