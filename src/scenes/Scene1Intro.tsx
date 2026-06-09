import {
    AbsoluteFill, Img, staticFile, interpolate, spring,
    useCurrentFrame, useVideoConfig, Easing,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { MacCursor } from "../components/MacCursor";

const { fontFamily } = loadFont("normal", { weights: ["300", "500", "600"] });

const BAR_W = 800, BAR_H = 116;
const BAR_LEFT = (1080 - BAR_W) / 2;
const BAR_TOP = 1200;
const CLICK = 26;

const Paperclip: React.FC<{ color: string }> = ({ color }) => (
    <svg width={54} height={54} viewBox="0 0 24 24" fill="none"
        stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5l-8.95 8.95a5 5 0 0 1-7.07-7.07l9.19-9.19a3.33 3.33 0 0 1 4.71 4.71l-9.2 9.19a1.67 1.67 0 0 1-2.36-2.36l8.49-8.48" />
    </svg>
);

export const Scene1Intro: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // курсор едет к скрепке и кликает
    const cx = interpolate(frame, [0, 22], [820, BAR_LEFT + 58], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
    });
    const cy = interpolate(frame, [0, 22], [1500, BAR_TOP + 58], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
    });
    const cursorOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
    const clickDip = interpolate(frame, [CLICK - 2, CLICK, CLICK + 5], [1, 0.9, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const clipPulse = interpolate(frame, [CLICK - 2, CLICK, CLICK + 6], [1, 0.82, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

    // фото появляется после клика (пружиной)
    const photoIn = spring({ frame: frame - CLICK, fps, config: { damping: 18, stiffness: 90 }, durationInFrames: 28 });
    const photoScale = interpolate(photoIn, [0, 1], [0.85, 1]);
    const photoY = interpolate(photoIn, [0, 1], [70, 0]);

    // плейсхолдер → «фото загружено» (с микрозадержкой после клика)
    const placeholderOpacity = interpolate(frame, [CLICK + 4, CLICK + 12], [1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const uploadedOpacity = interpolate(frame, [CLICK + 10, CLICK + 20], [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

    // заголовок держится до конца сцены (без исчезновения)
    const headerOpacity = interpolate(frame, [0, 16], [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

    return (
        <AbsoluteFill style={{ backgroundColor: "#0F1923", fontFamily }}>
            {/* верхний титр */}
            <div style={{
                position: "absolute", top: 360, width: "100%", textAlign: "center",
                color: "#F0F4F8", fontWeight: 300, fontSize: 56, letterSpacing: -1, opacity: headerOpacity,
            }}>Начни с <span style={{ fontWeight: 600 }}>фото.</span></div>

            {/* фото */}
            <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
                <Img src={staticFile("source.jpg")} style={{
                    width: 600, borderRadius: 36, objectFit: "cover",
                    opacity: photoIn,
                    transform: `translateY(${photoY - 110}px) scale(${photoScale})`,
                    boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
                }} />
            </AbsoluteFill>

            {/* TG-строка ввода */}
            <div style={{
                position: "absolute", left: BAR_LEFT, top: BAR_TOP, width: BAR_W, height: BAR_H,
                borderRadius: 30, background: "#15212E", display: "flex", alignItems: "center",
                padding: "0 30px", gap: 22, boxShadow: "0 18px 50px rgba(0,0,0,0.4)",
            }}>
                <div style={{ transform: `scale(${clipPulse})`, display: "flex" }}>
                    <Paperclip color="#7C8AA0" />
                </div>
                <div style={{ position: "relative", flex: 1, height: 44 }}>
                    <span style={{
                        position: "absolute", left: 0, top: 2, fontSize: 34, color: "#6B7A8D",
                        fontWeight: 300, opacity: placeholderOpacity,
                    }}>Напишите сообщение…</span>
                    <span style={{
                        position: "absolute", left: 14, top: 0, fontSize: 34, color: "#E8660A",
                        fontWeight: 600, opacity: uploadedOpacity,
                    }}>✓ Фото загружено</span>
                </div>
            </div>

            {/* курсор */}
            <div style={{
                position: "absolute", left: cx, top: cy, opacity: cursorOpacity,
                transform: `scale(${clickDip})`,
            }}>
                <MacCursor />
            </div>
        </AbsoluteFill>
    );
};
