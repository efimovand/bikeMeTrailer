import {
    AbsoluteFill, Img, staticFile, interpolate, spring,
    useCurrentFrame, useVideoConfig, Easing,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["300", "600", "700"] });

// ↓ крутилки изометрии (курсор живёт в ЭТОЙ же перспективе)
const ROT_X = 40, ROT_Z = -24, SCALE = 1.28;

const COLS = 3, GAP = 30;
const CARD_W = 300, CARD_H = 360;

// файлы берутся 1:1 из public/colors (без подписей)
const COLORS: string[] = [
    "black", "white", "soleluna",
    "speedarmororange", "tropicrush", "lyzard",
    "grazievale", "punkpulse", "bezzecchi",
    "fastlapredwhiteblue", "track46", "sling",
    "blackmatte", "limit46", "fastlapblackred",
    "fastlappurpleyellow", "rossiwintertest", "speedarmorwhite",
];

// ── прокрутка: тормозит НЕ доезжая до конца листа (нет пустого пространства под последним рядом)
// Скорость флика фиксирована (SCROLL_SPEED, профиль cubic.out) → длительность скролла авто-выводится от дистанции.
// Тюнить ТОЛЬКО SCROLL_TO (точка остановки): меньше по модулю → встаёт раньше/выше, больше → докручивает ниже.
const SCROLL_FROM = 260, SCROLL_TO = -860;
const SCROLL_SPEED = 13.48;                                              // px/кадр (исходно 1240/92), скорость не трогаем
const SCROLL_END = Math.round((SCROLL_FROM - SCROLL_TO) / SCROLL_SPEED); // ≈83 при -860

// ── цель клика: limit46 = index 13 → row 4, центральный столбец (следующий ряд) ──
const TARGET_INDEX = 13;
const TARGET_ROW = 4, TARGET_COL = 1;

const CLICK = SCROLL_END;            // момент остановки скролла
const CURSOR_IN_START = CLICK - 30;  // палец начинает вводиться
const CURSOR_FADE_END = CLICK - 14;  // палец полностью проявился

// центр целевой карточки в координатах прокручиваемой колонки
const CARD_CX = TARGET_COL * (CARD_W + GAP) + CARD_W / 2;   // 480
const CARD_CY = TARGET_ROW * (CARD_H + GAP) + CARD_H / 2;   // 1740

// ── 3D-курсор-палец (живёт внутри контента → та же перспектива + точная привязка) ──
const CURSOR_W = 340;
const CURSOR_OFF_X = -85;    // смещение png от центра карточки (кончик пальца → на шлем)
const CURSOR_OFF_Y = -70;
const CURSOR_Z = 80;          // приподнять над плоскостью сетки
const CURSOR_ROT = 20;        // поворот вокруг своей оси (по часовой), чтобы смотрел «вверх» по сетке

export const SceneColorScroll: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const scrollY = interpolate(frame, [0, SCROLL_END], [SCROLL_FROM, SCROLL_TO], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
    });
    // заголовок выезжает с самого верха кадра вниз на место
    const headerOpacity = interpolate(frame, [4, 18], [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    const headerY = interpolate(frame, [4, 30], [-260, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

    // палец «вводится» сверху в кадр (как рука тянется), потом давит
    const cursorIn = spring({ frame: frame - CURSOR_IN_START, fps, config: { damping: 18, stiffness: 90 }, durationInFrames: 24 });
    const cursorOpacity = interpolate(frame, [CURSOR_IN_START, CURSOR_FADE_END], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const enterY = interpolate(cursorIn, [0, 1], [140, 0]);
    const enterScale = interpolate(cursorIn, [0, 1], [0.72, 1]);

    // клик: дип вниз + сжатие (как в Scene1)
    const clickScale = interpolate(frame, [CLICK - 2, CLICK, CLICK + 7], [1, 0.86, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const clickDipY = interpolate(frame, [CLICK - 2, CLICK, CLICK + 7], [0, 20, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

    const rows: string[][] = [];
    for (let i = 0; i < COLORS.length; i += COLS) rows.push(COLORS.slice(i, i + COLS));

    return (
        <AbsoluteFill style={{ backgroundColor: "#0F1923", fontFamily, overflow: "hidden" }}>
            <AbsoluteFill style={{ perspective: 1800, perspectiveOrigin: "50% 38%" }}>
                <AbsoluteFill style={{
                    transformStyle: "preserve-3d", alignItems: "center",
                    transform: `rotateX(${ROT_X}deg) rotateZ(${ROT_Z}deg) scale(${SCALE})`,
                }}>
                    <div style={{ transform: `translateY(${scrollY}px)`, marginTop: 200, display: "flex", flexDirection: "column", gap: GAP, position: "relative" }}>
                        {rows.map((row, r) => (
                            <div key={r} style={{ display: "flex", gap: GAP }}>
                                {row.map((file, ci) => {
                                    const idx = r * COLS + ci;
                                    const isTarget = idx === TARGET_INDEX;
                                    const hl = isTarget
                                        ? interpolate(frame, [CLICK, CLICK + 8], [0, 1],
                                            { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
                                        : 0;
                                    return (
                                        <div key={file} style={{
                                            width: CARD_W, height: CARD_H, borderRadius: 24, overflow: "hidden", background: "#fff",
                                            boxShadow: "0 22px 55px rgba(0,0,0,0.4)", position: "relative",
                                            display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
                                            transform: `scale(${1 + 0.04 * hl})`,
                                        }}>
                                            <Img src={staticFile(`colors/k1s_${file}.jpg`)}
                                                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                                            {/* оранжевая рамка-выбор в момент клика */}
                                            {isTarget && (
                                                <div style={{
                                                    position: "absolute", inset: 0, borderRadius: 24,
                                                    boxShadow: "inset 0 0 0 5px #E8660A", opacity: hl, pointerEvents: "none",
                                                }} />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}

                        {/* 3D-курсор-палец — внутри контента: та же перспектива + точная привязка к карточке */}
                        <Img src={staticFile("pointer.png")} style={{
                            position: "absolute", left: CARD_CX + CURSOR_OFF_X, top: CARD_CY + CURSOR_OFF_Y, width: CURSOR_W,
                            opacity: cursorOpacity,
                            transform: `translateZ(${CURSOR_Z}px) translateY(${enterY + clickDipY}px) rotate(${CURSOR_ROT}deg) scale(${enterScale * clickScale})`,
                            transformOrigin: "40% 12%",
                            filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.45))",
                            pointerEvents: "none",
                        }} />
                    </div>
                </AbsoluteFill>
            </AbsoluteFill>

            <AbsoluteFill style={{
                background: "linear-gradient(180deg, #0F1923 0%, transparent 22%, transparent 78%, #0F1923 100%)",
                pointerEvents: "none",
            }} />

            <div style={{ position: "absolute", top: 120, width: "100%", textAlign: "center", opacity: headerOpacity, transform: `translateY(${headerY}px)` }}>
                <div style={{ color: "#E8660A", fontWeight: 700, fontSize: 26, letterSpacing: 3 }}>ВЫБОР ЦВЕТА</div>
                <div style={{ color: "#F0F4F8", fontWeight: 300, fontSize: 56, letterSpacing: -1, marginTop: 6 }}>
                    AGV <span style={{ fontWeight: 700 }}>K1-S</span>
                </div>
            </div>
        </AbsoluteFill>
    );
};
