import {
    AbsoluteFill, Img, staticFile, interpolate, spring,
    useCurrentFrame, useVideoConfig, Easing,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["300", "600", "700"] });

const CENTER = 540;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const EDGE_FADE = "linear-gradient(90deg,#08080B 0%, transparent 14%, transparent 86%, #08080B 100%)";

// ── бренды: цельная лента brands.png (CS-кейс), крупный масштаб ──
const BIMG_W = 8000, BIMG_H = 833, BRAND_COUNT = 10, BMW_INDEX = 4;
const B_DISP_H = 390;
const B_SCALE = B_DISP_H / BIMG_H;
const B_DISP_W = BIMG_W * B_SCALE;
const B_CELL = B_DISP_W / BRAND_COUNT;
const B_FINAL = CENTER - (B_DISP_W + (BMW_INDEX + 0.5) * B_CELL); // BMW во 2-й копии
const B_START = CENTER - 1.5 * B_CELL;
const B_TOP = 430;

// ── силуэты: тот же стиль, что лого — плоские ячейки, без тени ──
const SIL: [string, string][] = [
    ["s1000rr", "S1000RR"], ["r1300gs", "R1300GS"], ["r18", "R18"], ["s1000xr", "S1000XR"],
    ["rninet", "R nineT"], ["f900r", "F900R"], ["r1300rt", "R1300RT"], ["k1600gtl", "K1600GTL"],
    ["g310r", "G310R"], ["ce04", "CE 04"], ["r12gs", "R12GS"], ["c400gt", "C400GT"],
    ["f900gs", "F900GS"], ["s1000r", "S1000R"], ["r1200gs", "R1200GS"], ["c400x", "C400X"],
];
const SIL_REEL = [...SIL, ...SIL];
// карточки моделей 1:1 как у логотипов (Figma: лента 4096, карточка 391×388, зазор 17, радиус 20)
const FIG_W = 4096, FIG_CARD_W = 391, FIG_CARD_H = 388, FIG_GAP = 17, FIG_RADIUS = 20;
const FIG_SCALE = B_DISP_W / FIG_W;
const S_CARD_W = FIG_CARD_W * FIG_SCALE;
const S_CARD_H = FIG_CARD_H * FIG_SCALE;
const S_STEP = (FIG_CARD_W + FIG_GAP) * FIG_SCALE;
const S_RADIUS = FIG_RADIUS * FIG_SCALE;
const S_H = B_DISP_H, S_TOP = 880;
const S_TARGET = 16, S_START = 1;   // влево, как лого-лента; длинный пролёт = «крутится», а не «слайдит»
const CELL_BG = "#1A1A1E";   // = цвет ячеек brands.png

export const SceneBikePick: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const headerOpacity = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: "clamp" });

    // фаза 1: бренды крутятся уже во время проявления сцены (старт с 0),
    // ease-out — быстрый старт, плавная доводка до остановки
    const brandProg = interpolate(frame, [0, 60], [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    const bx = lerp(B_START, B_FINAL, brandProg);

    // фаза 2: полоса силуэтов выезжает чуть раньше — чтобы состыковать
    // с плавной остановкой верхней ленты (без прогала)
    const silIn = spring({ frame: frame - 48, fps, config: { damping: 22, stiffness: 70 }, durationInFrames: 24 });
    const silGroupY = lerp(220, 0, silIn);
    // прокрутка стартует ДО появления — лента «выезжает уже в движении»
    const silProg = interpolate(frame, [46, 116], [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    const sFinal = CENTER - (S_TARGET * S_STEP + S_STEP / 2);
    const sStart = CENTER - (S_START * S_STEP + S_STEP / 2);
    const sx = lerp(sStart, sFinal, silProg);

    // подсветка выбранного завершает появление РОВНО в момент остановки ленты
    // (бренды стопаются на 60, силуэты на 126) — чтобы рамка вспыхивала на стопе
    const brandHl = interpolate(frame, [52, 58], [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    const silHl = interpolate(frame, [112, 118], [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

    // подпись модели всплывает ЧУТЬ ПОЗЖЕ остановки/рамки
    const capOpacity = interpolate(frame, [136, 152], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

    return (
        <AbsoluteFill style={{ backgroundColor: "#0F1923", fontFamily }}>
            {/* заголовок */}
            <div style={{
                position: "absolute", top: 240, width: "100%", textAlign: "center",
                color: "#F0F4F8", fontWeight: 300, fontSize: 56, letterSpacing: -1, opacity: headerOpacity,
            }}>Выбери <span style={{ fontWeight: 600 }}>байк.</span></div>

            {/* лента брендов */}
            <div style={{ position: "absolute", top: B_TOP, left: 0, width: 1080, height: B_DISP_H, overflow: "hidden", background: "#08080B" }}>
                <div style={{ position: "absolute", height: B_DISP_H, display: "flex", transform: `translateX(${bx}px)` }}>
                    <Img src={staticFile("brands.png")} style={{ height: B_DISP_H, width: B_DISP_W }} />
                    <Img src={staticFile("brands.png")} style={{ height: B_DISP_H, width: B_DISP_W }} />
                </div>
                {/* подсветка выбранного (центральный слот) */}
                <div style={{
                    position: "absolute", left: CENTER - S_CARD_W / 2, top: (B_DISP_H - S_CARD_H) / 2,
                    width: S_CARD_W, height: S_CARD_H, borderRadius: S_RADIUS,
                    background: "rgba(217,217,217,0.10)", pointerEvents: "none", opacity: brandHl,
                }} />
                <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: EDGE_FADE }} />
            </div>

            {/* лента силуэтов — тот же стиль ячеек, без тени */}
            <div style={{
                position: "absolute", top: S_TOP, left: 0, width: 1080, height: S_H, overflow: "hidden",
                background: "#08080B", transform: `translateY(${silGroupY}px)`, opacity: silIn,
            }}>
                <div style={{ position: "absolute", height: S_H, transform: `translateX(${sx}px)` }}>
                    {SIL_REEL.map(([file], i) => (
                        <div key={i} style={{
                            position: "absolute", left: i * S_STEP, top: (S_H - S_CARD_H) / 2,
                            width: S_STEP, height: S_CARD_H, display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            <div style={{
                                width: S_CARD_W, height: S_CARD_H, borderRadius: S_RADIUS, background: CELL_BG,
                                display: "flex", alignItems: "center", justifyContent: "center", padding: 30,
                            }}>
                                <Img src={staticFile(`silhouettes/${file}.png`)}
                                    style={{ width: "100%", height: "100%", objectFit: "contain", transform: "scale(0.9)" }} />
                            </div>
                        </div>
                    ))}
                </div>
                {/* подсветка выбранного (центральный слот) */}
                <div style={{
                    position: "absolute", left: CENTER - S_CARD_W / 2, top: (S_H - S_CARD_H) / 2,
                    width: S_CARD_W, height: S_CARD_H, borderRadius: S_RADIUS,
                    background: "rgba(217,217,217,0.10)", pointerEvents: "none", opacity: silHl,
                }} />
                <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: EDGE_FADE }} />
            </div>

            {/* итоговая подпись */}
            <div style={{
                position: "absolute", top: 1340, width: "100%", textAlign: "center",
                color: "#F0F4F8", fontWeight: 300, fontSize: 58, letterSpacing: -1, opacity: capOpacity,
            }}>BMW <span style={{ fontWeight: 700 }}>S1000RR</span></div>
        </AbsoluteFill>
    );
};
