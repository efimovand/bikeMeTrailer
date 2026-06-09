import { Img, staticFile } from "remotion";

export const CatalogCard: React.FC<{
    img: string; tag: string; name: string; w?: number; h?: number;
}> = ({ img, tag, name, w = 300, h = 360 }) => (
    <div style={{
        width: w, height: h, borderRadius: 24, overflow: "hidden", background: "#fff",
        display: "flex", flexDirection: "column", boxShadow: "0 22px 55px rgba(0,0,0,0.4)",
    }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 18 }}>
            <Img src={staticFile(img)} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
        </div>
        <div style={{ background: "#15212E", padding: "12px 16px", borderLeft: "4px solid #E8660A" }}>
            <div style={{ color: "#E8660A", fontSize: 15, fontWeight: 700, letterSpacing: 1 }}>{tag}</div>
            <div style={{ color: "#F0F4F8", fontSize: 22, fontWeight: 600 }}>{name}</div>
        </div>
    </div>
);