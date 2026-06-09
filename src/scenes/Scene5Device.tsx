import {
    AbsoluteFill, Img, staticFile, interpolate, spring,
    useCurrentFrame, useVideoConfig, Easing,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["300", "500", "600"] });
const DW = 560, DH = Math.round(DW * 1745 / 855);

export const Scene5Device: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const pull = spring({ frame, fps, config: { damping: 20, stiffness: 70 }, durationInFrames: 34 });
    const scale = interpolate(pull, [0, 1], [1.7, 1.0]);
    const capOpacity = interpolate(frame, [40, 58], [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    const capY = interpolate(frame, [40, 58], [36, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

    return (
        <AbsoluteFill style={{ backgroundColor: "#0F1923", fontFamily, justifyContent: "center", alignItems: "center" }}>
            <div style={{ position: "relative", width: DW, height: DH, transform: `scale(${scale})` }}>
                <Img src={staticFile("device.png")} style={{ width: "100%", height: "100%" }} />

                {/* бабл бота — поверх экрана */}
                <div style={{
                    position: "absolute", left: 50, bottom: 60, padding: "14px 20px", borderRadius: 22,
                    background: "rgba(20,28,38,0.92)", color: "#fff", fontSize: 28, fontWeight: 500,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
                }}>Готово ✓</div>
            </div>

            <div style={{
                position: "absolute", bottom: 150, width: "100%", textAlign: "center",
                color: "#F0F4F8", fontWeight: 300, fontSize: 50, letterSpacing: -1,
                opacity: capOpacity, transform: `translateY(${capY}px)`,
            }}>Примерочная — прямо в <span style={{ fontWeight: 600 }}>Telegram.</span></div>
        </AbsoluteFill>
    );
};
