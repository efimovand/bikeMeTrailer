import {
    AbsoluteFill, Img, staticFile, interpolate, spring,
    useCurrentFrame, useVideoConfig, Easing,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { MacCursor } from "../components/MacCursor";

const { fontFamily } = loadFont("normal", { weights: ["300", "500", "600"] });

const TILE = 300, GAP = 28;
const GRID = TILE * 2 + GAP;
const LEFT = (1080 - GRID) / 2;
const TOP = (1920 - GRID) / 2;

// курсор кликает сначала левую плитку, затем правую
const POS = {
    left: { x: LEFT + TILE / 2, y: TOP + TILE / 2 },
    right: { x: LEFT + TILE + GAP + TILE / 2, y: TOP + TILE / 2 },
};
// куртка слева (первый клик) → шлем справа (последний клик, запускает выбор цвета)
const CLICK1 = 24, CLICK2 = 47;

const clickDip = (frame: number, at: number) =>
    interpolate(frame, [at - 2, at, at + 5], [1, 0.94, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const Tile: React.FC<{ img: string; label: string; sel: number; dip: number }> =
    ({ img, label, sel, dip }) => (
        <div style={{
            width: TILE, height: TILE, borderRadius: 28, overflow: "hidden", position: "relative",
            transform: `scale(${dip * (1 + 0.03 * sel)})`,
            boxShadow: `0 0 0 ${4 * sel}px #E8660A, 0 20px 50px rgba(0,0,0,0.45)`,
        }}>
            <Img src={staticFile(`setup/${img}`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center -10px", background: 'white' }} />

            {/* мягкая тень снизу + название категории поверх фото */}
            <div style={{
                position: "absolute", left: 0, right: 0, bottom: 0, height: "55%",
                background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 45%, transparent 100%)",
                display: "flex", alignItems: "flex-end",
            }}>
                <div style={{ padding: "0 20px 18px", color: "#fff", fontWeight: 600, fontSize: 30, letterSpacing: -0.3 }}>
                    {label}
                </div>
            </div>

            {/* галочка выбранного */}
            <div style={{
                position: "absolute", top: 14, right: 14, width: 44, height: 44, borderRadius: 22,
                background: "#E8660A", color: "#fff", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 26, opacity: sel, transform: `scale(${sel})`,
            }}>✓</div>
        </div>
    );

export const Scene2Select: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const cx = interpolate(frame, [0, 22, 45], [880, POS.left.x, POS.right.x],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
    const cy = interpolate(frame, [0, 22, 45], [1480, POS.left.y, POS.right.y],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
    const cursorOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
    const cursorPulse = Math.min(clickDip(frame, CLICK1), clickDip(frame, CLICK2));

    const jacketSel = spring({ frame: frame - CLICK1, fps, config: { damping: 14 }, durationInFrames: 18 });
    const helmetSel = spring({ frame: frame - CLICK2, fps, config: { damping: 14 }, durationInFrames: 18 });
    const headerOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });

    return (
        <AbsoluteFill style={{ backgroundColor: "#0F1923", fontFamily }}>
            <div style={{
                position: "absolute", top: TOP - 110, width: "100%", textAlign: "center",
                color: "#F0F4F8", fontWeight: 300, fontSize: 52, letterSpacing: -1, opacity: headerOpacity,
            }}>Собери свой <span style={{ fontWeight: 600 }}>сетап</span></div>

            <div style={{
                position: "absolute", left: LEFT, top: TOP,
                display: "grid", gridTemplateColumns: `repeat(2, ${TILE}px)`, gap: GAP,
            }}>
                {/* куртка слева — первый клик; шлем справа — последний клик (→ выбор цвета) */}
                <Tile img="jacket.jpg" label="Куртка" sel={jacketSel} dip={clickDip(frame, CLICK1)} />
                <Tile img="helmet.jpg" label="Шлем" sel={helmetSel} dip={clickDip(frame, CLICK2)} />
                <Tile img="gloves.jpg" label="Перчатки" sel={0} dip={1} />
                <Tile img="boots.jpg" label="Мотоботы" sel={0} dip={1} />
            </div>

            <div style={{ position: "absolute", left: cx, top: cy, opacity: cursorOpacity, transform: `scale(${cursorPulse})` }}>
                <MacCursor />
            </div>
        </AbsoluteFill>
    );
};
