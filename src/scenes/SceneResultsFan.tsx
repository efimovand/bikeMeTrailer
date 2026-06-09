import {
    AbsoluteFill, Img, staticFile, interpolate, spring,
    useCurrentFrame, useVideoConfig, Easing,
} from "remotion";

const FAN = [
    "17.png", "20.png", "19.png",
    "11.png", "13.png", "6.jpg", "14.png",
    "18.png", "5.jpg", "10.png",
    "15.png", "7.jpg", "1.jpg", "16.png",
    "12.png", "4.jpg", "8.jpg",
];
const CENTER = 1;
const HANDOFF = FAN.indexOf("1.jpg");

const CARD_W = 420, CARD_H = 420, RADIUS = 22;   // квадратные плитки (cover кропит)
const GROUP_BIG = 2.32;                 // старт: герой ≈900px; пропорционально GROUP_GRID (2.14 × 1.3/1.2)
const GROUP_GRID = 1.3;                 // крупнее: стена вылезает за края (крайние режутся — задумка)
const GRID_SCALE = 0.7;                 // размер карты внутри ячейки
const CELL_W = 300, CELL_H = 300;       // квадратный шаг сетки
const ROWS = [3, 4, 3, 4, 3];           // кирпичная раскладка = 17
const ROW_START = 800, ROW_SET = 960;

// целевой вид карты = карточка Scene4Deck (760×860, TOP 380 → центр 540,810, радиус 36)
const TGT_CX = 540, TGT_CY = 810, TGT_W = 760, TGT_H = 860, TGT_R = 36;

// ячейки сетки в координатах группы (центр = 0,0)
const SLOTS: [number, number][] = [];
ROWS.forEach((count, ri) => {
    const gy = (ri - (ROWS.length - 1) / 2) * CELL_H;
    for (let cj = 0; cj < count; cj++) SLOTS.push([(cj - (count - 1) / 2) * CELL_W, gy]);
});
const CSLOT = SLOTS.findIndex(([gx, gy]) => gx === 0 && gy === 0);
const REST = SLOTS.filter((_, k) => k !== CSLOT);
const slotFor = (i: number): [number, number] =>
    i === CENTER ? SLOTS[CSLOT] : REST[i < CENTER ? i : i - 1];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const SceneResultsFan: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // пружинная сборка плитки i из центра (дальние стартуют чуть позже)
    const springA = (i: number) => {
        const [gx, gy] = slotFor(i);
        const dist = Math.hypot(gx, gy);
        return spring({
            frame: frame - 4 - (dist / 760) * 6, fps,
            config: { damping: 18, stiffness: 90 }, durationInFrames: 28,
        });
    };

    // отдаление: герой 900px → стена
    const zoomOut = spring({ frame, fps, config: { damping: 26, stiffness: 70 }, durationInFrames: 28 });
    const groupScale = interpolate(zoomOut, [0, 1.3], [GROUP_BIG, GROUP_GRID]);
    const rowY = interpolate(zoomOut, [0, 1.3], [ROW_START, ROW_SET]);

    // плитки расползания гаснут (после того как стена собралась)
    const flash = interpolate(frame, [36, 58], [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    // морф: итоговая карта «влетает» из своей плитки в позицию карточки Scene4Deck;
    // завершается ровно к старту перехода (кадр 66) → дальше мягкий fade-кроссфейд
    const morph = interpolate(frame, [34, 66], [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });

    // ЖИВАЯ геометрия плитки-цели: из текущих groupScale/rowY/springA каждый кадр
    // → морф стартует ТОЧНО с позиции плитки при любом масштабе (нет прыжка/пролага)
    const [hx, hy] = slotFor(HANDOFF);
    const aH = springA(HANDOFF);
    const csH = 1 - (1 - GRID_SCALE) * aH;
    const tileCX = 540 + hx * aH * groupScale;
    const tileCY = rowY + hy * aH * groupScale;
    const tileSz = CARD_W * csH * groupScale;
    const tileR = RADIUS * csH * groupScale;
    const mW = lerp(tileSz, TGT_W, morph), mH = lerp(tileSz, TGT_H, morph);
    const mCX = lerp(tileCX, TGT_CX, morph), mCY = lerp(tileCY, TGT_CY, morph);
    const mR = lerp(tileR, TGT_R, morph);

    return (
        <AbsoluteFill style={{ backgroundColor: "#0F1923" }}>
            <div style={{
                position: "absolute", left: 540, top: rowY,
                transform: `translate(-50%, -50%) scale(${groupScale})`,
            }}>
                {FAN.map((src, i) => {
                    const [gx, gy] = slotFor(i);
                    const dist = Math.hypot(gx, gy);
                    const a = springA(i);
                    const cx = gx * a, cy = gy * a;
                    const cs = 1 - (1 - GRID_SCALE) * a;        // герой(1) → ячейка(0.7)
                    const z = Math.round(100 - dist * 0.05);
                    // целевую плитку прячем, когда её подхватывает морф-карта (они в одной точке → бесшовно)
                    const cardOpacity = i === HANDOFF
                        ? (morph > 0 ? 0 : 1)
                        : Math.max(0, 1 - flash * 1.7);
                    return (
                        <div key={i} style={{
                            position: "absolute", left: cx - CARD_W / 2, top: cy - CARD_H / 2,
                            width: CARD_W, height: CARD_H, borderRadius: RADIUS, overflow: "hidden",
                            transform: `scale(${cs})`,
                            zIndex: z, opacity: cardOpacity,
                            boxShadow: "0 24px 60px rgba(0,0,0,0.5), 0 0 0 1.5px rgba(255,255,255,0.06)",
                        }}>
                            <Img src={staticFile(`generations/${src}`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                    );
                })}
            </div>

            {/* морф-карта: влетает из плитки и точно садится в карточку Scene4Deck (760×860, центр 540,810) */}
            {morph > 0 && (
                <div style={{
                    position: "absolute", left: mCX - mW / 2, top: mCY - mH / 2,
                    width: mW, height: mH, borderRadius: mR, overflow: "hidden", zIndex: 500,
                    boxShadow: "0 30px 80px rgba(0,0,0,0.5)",   // = тень карточки Scene4Deck
                }}>
                    <Img src={staticFile(`generations/${FAN[HANDOFF]}`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
            )}
        </AbsoluteFill>
    );
};
