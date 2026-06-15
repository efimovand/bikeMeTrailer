import { AbsoluteFill, Img, interpolate, useCurrentFrame, Easing, spring, useVideoConfig, staticFile } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: fontInter } = loadInter("normal", { weights: ["300", "400", "600", "700"] });

const fontFamily = "Mescalito";

if (typeof document !== "undefined") {
    const f1 = new FontFace(fontFamily, `url(${staticFile("fonts/mescalito.otf")})`);
    f1.load().then((f: FontFace) => document.fonts.add(f));
}

const ORANGE = "#E8660A";

/* ─────────── Иконка «без звука» (muted, как в списке чатов TG) ─────────── */
/* Двойная галочка */
const DoubleCheckIcon: React.FC<{ color?: string }> = ({ color = "#4FA3E8" }) => (
    <svg width="43" height="24" viewBox="0 0 40 22" fill="none">
        <path d="M2 12l7 7L23 3" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 12l7 7L35 3" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/* Иконка «закреплено» (pinned, как в списке чатов TG) */
const PinIcon: React.FC<{ color?: string; size?: number; style?: React.CSSProperties; }> = ({ color = "#7B8FA0", size = 35, style }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
        <g transform="rotate(45 12 12)">
            <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" fill={color} />
        </g>
    </svg>
);

/* Иконка-плейсхолдер лого */
const ImageIcon: React.FC<{ color?: string; size?: number }> = ({ color = ORANGE, size = 53 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4.5" width="18" height="15" rx="3" stroke={color} strokeWidth="1.8" />
        <circle cx="8.3" cy="10" r="1.8" fill={color} />
        <path d="M4.5 17.5L9.5 12l3.5 3.6L16 12l3.5 4.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/* TgHeader */
const TG_W = 960;
const TG_H = 157;
const AVATAR = 116;

const TgHeader: React.FC<{ isCustom?: boolean; name: string; bgColor: string }> = ({
    isCustom = false, name, bgColor,
}) => (
    <div style={{
        width: TG_W,
        height: TG_H,
        background: bgColor,
        display: "flex",
        alignItems: "center",
        paddingLeft: 25,
        paddingRight: 28,
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
    }}>
        {/* Аватар */}
        {isCustom ? (
            <div style={{
                width: AVATAR, height: AVATAR,
                borderRadius: "50%", flexShrink: 0,
                boxSizing: "border-box",
                border: "2px dashed rgba(232,102,10,0.85)",
                background: "rgba(232,102,10,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center",
            }}>
                <ImageIcon size={53} />
            </div>
        ) : (
            <div style={{
                width: AVATAR, height: AVATAR,
                borderRadius: "50%", flexShrink: 0, overflow: "hidden",
            }}>
                <Img src={staticFile("tg_logo.png")}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
        )}

        {/* текст */}
        <div style={{
            marginLeft: 30,
            display: "flex", flexDirection: "column",
            justifyContent: "center",
            flex: 1, minWidth: 0,
        }}>
            <span style={{
                color: "#F0F4F8",
                fontSize: 33,
                fontWeight: 500,
                letterSpacing: -0.2,
                fontFamily: fontInter,
                lineHeight: 1,
                whiteSpace: "nowrap",
            }}>
                {name}
            </span>
            <div style={{
                color: "#7B8FA0",
                fontSize: 35,
                fontWeight: 400,
                fontFamily: fontInter,
                letterSpacing: -0.1,
                lineHeight: 1,
                marginTop: 26,
            }}>
                /start
            </div>
        </div>

        {/* правый блок */}
        <div style={{
            display: "flex", flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "space-between",
            alignSelf: "stretch",
            paddingTop: 28,
            paddingBottom: 25,
            flexShrink: 0,
            marginLeft: 8,
        }}>
            <div style={{
                display: "flex", alignItems: "center",
                gap: 9,
                color: "#7B8FA0",
                fontSize: 33,
                fontFamily: fontInter,
                fontWeight: 400,
            }}>
                <DoubleCheckIcon color={isCustom ? ORANGE : "#4FA3E8"} />
                <span>18:35</span>
            </div>
            <PinIcon size={38} color={isCustom ? "rgba(232,102,10,0.7)" : "#7B8FA0"} style={{ marginLeft: -5 }} />
        </div>
    </div>
);

export const Scene6Outro: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const logoOpacity = interpolate(frame, [0, 12, 50, 66], [0, 1, 1, 0], { extrapolateRight: "clamp" });
    const sweep = interpolate(frame, [8, 42], [200, -120],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease) });

    const cliOpacity = interpolate(frame, [60, 84], [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    const cliY = interpolate(frame, [60, 84], [40, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    const shopSlideY = interpolate(frame, [132, 162], [0, 140],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
    const shopFade = interpolate(frame, [132, 157], [1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

    // ── оранжевый луч: слева направо, медленнее (Apple-темп) ──
    const wipeX = interpolate(frame, [90, 120], [0, TG_W + 4],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
    const lineOpacity = interpolate(frame, [87, 92, 114, 120], [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

    const tagOpacity = interpolate(frame, [148, 172], [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

    const row1Spring = spring({ frame: frame - 142, fps, config: { damping: 28, stiffness: 80 }, durationInFrames: 30 });
    const row2Spring = spring({ frame: frame - 158, fps, config: { damping: 28, stiffness: 80 }, durationInFrames: 30 });
    const contactSpring = spring({ frame: frame - 174, fps, config: { damping: 32, stiffness: 90 }, durationInFrames: 24 });

    const row1X = interpolate(row1Spring, [0, 1], [-500, 0]);
    const row1O = interpolate(row1Spring, [0, 0.35, 1], [0, 1, 1]);
    const row2X = interpolate(row2Spring, [0, 1], [500, 0]);
    const row2O = interpolate(row2Spring, [0, 0.35, 1], [0, 1, 1]);
    const contactO = interpolate(contactSpring, [0, 1], [0, 1]);
    const contactY = interpolate(contactSpring, [0, 1], [16, 0]);

    return (
        <AbsoluteFill style={{ backgroundColor: "#0F1923", fontFamily: fontInter, justifyContent: "center", alignItems: "center" }}>

            {/* BikeMe */}
            <div style={{
                position: "absolute", opacity: logoOpacity,
                fontSize: 130, fontWeight: 700, letterSpacing: -3,
                fontFamily: fontInter,
                color: "transparent",
                backgroundImage: "linear-gradient(110deg, #E6ECF2 42%, #ffffff 50%, #E6ECF2 58%)",
                backgroundSize: "300% 100%", backgroundPosition: `${sweep}% 0%`,
                WebkitBackgroundClip: "text", backgroundClip: "text",
            }}>BikeMe</div>

            {/* анимация ребрендинга */}
            <div style={{
                position: "absolute",
                opacity: cliOpacity * shopFade,
                transform: `translateY(${cliY + shopSlideY}px)`,
                display: "flex", flexDirection: "column", alignItems: "center",
            }}>
                <div style={{
                    position: "relative", width: TG_W, height: TG_H,
                    borderRadius: 24, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
                }}>
                    {/* до */}
                    <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 0 ${wipeX}px)` }}>
                        <TgHeader name="BikeMeBot" bgColor="rgb(21,33,46)" />
                    </div>

                    {/* после */}
                    <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${TG_W - wipeX}px 0 0)` }}>
                        <TgHeader isCustom name="Ваш магазин" bgColor="rgb(30,28,34)" />
                    </div>

                    {/* оранжевая линия */}
                    <div style={{
                        position: "absolute", left: wipeX - 2, top: 0, width: 4, height: TG_H,
                        background: ORANGE, opacity: lineOpacity, borderRadius: 2,
                        boxShadow: `0 0 16px ${ORANGE}, 0 0 32px rgba(232,102,10,0.4)`,
                    }} />
                </div>
            </div>

            {/* tagline */}
            <div style={{
                position: "absolute", bottom: 140, width: "100%", textAlign: "center",
                color: "#F0F4F8", fontWeight: 300, fontSize: 46, letterSpacing: -0.5,
                opacity: tagOpacity, fontFamily: fontInter,
            }}>Примерочная для <span style={{ fontWeight: 600 }}>вашего магазина.</span></div>

            {/* ценовые строки */}
            <div style={{
                position: "absolute",
                top: 0, left: 0, right: 0, bottom: 0,
                display: "flex", flexDirection: "column",
                justifyContent: "center",
                gap: 16,
                paddingBottom: 160,
            }}>
                {/* строка 1 — слева */}
                <div style={{
                    fontFamily: fontFamily,
                    fontSize: 220,
                    color: "#F0F4F8",
                    lineHeight: 0.9,
                    paddingLeft: 44,
                    transform: `translateX(${row1X}px) scaleY(1.5)`,
                    opacity: row1O,
                    whiteSpace: "nowrap",
                    marginBottom: 80
                }}>
                    SaaS <span style={{ color: ORANGE }}>помесячно</span>
                </div>

                {/* строка 2 — справа */}
                <div style={{
                    fontFamily: fontFamily,
                    fontSize: 220,
                    color: "#F0F4F8",
                    lineHeight: 0.9,
                    paddingRight: 44,
                    textAlign: "right",
                    transform: `translateX(${row2X}px) scaleY(1.5)`,
                    opacity: row2O,
                    whiteSpace: "nowrap",
                    marginBottom: 60
                }}>
                    Buy-out <span style={{ color: ORANGE }}>под ключ</span>
                </div>

                {/* контакт */}
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "flex-end",
                    paddingRight: 44, gap: 10, marginTop: 20,
                    opacity: contactO,
                    transform: `translateY(${contactY}px)`,
                    fontFamily: fontInter,
                }}>
                    <span style={{ color: "#9FB0C0", fontSize: 30, fontWeight: 300, marginRight: 6 }}>Андрей Ефимов</span>
                    <svg
                        style={{ transform: "translateY(1px)" }}
                        width="36"
                        height="36"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle
                            cx="16"
                            cy="16"
                            r="15"
                            fill="none"
                            stroke={ORANGE}
                            strokeWidth="1.5"
                            opacity="0.6"
                        />

                        <path
                            d="M22.9866 10.2088C23.1112 9.40332 22.3454 8.76755 21.6292 9.082L7.36482 15.3448C6.85123 15.5703 6.8888 16.3483 7.42147 16.5179L10.3631 17.4547C10.9246 17.6335 11.5325 17.541 12.0228 17.2023L18.655 12.6203C18.855 12.4821 19.073 12.7665 18.9021 12.9426L14.1281 17.8646C13.665 18.3421 13.7569 19.1512 14.314 19.5005L19.659 22.8523C20.2585 23.2282 21.0297 22.8506 21.1418 22.1261L22.9866 10.2088Z"
                            fill={ORANGE}
                        />
                    </svg>
                    <span style={{ color: "#9FB0C0", fontSize: 30, fontWeight: 300 }}>efimov_and</span>
                </div>
            </div>

        </AbsoluteFill>
    );
};
