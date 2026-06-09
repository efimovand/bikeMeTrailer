import { AbsoluteFill, interpolate } from "remotion";
import type {
    TransitionPresentation,
    TransitionPresentationComponentProps,
} from "@remotion/transitions";

type ZoomProps = Record<string, never>;

const ZoomPresentation: React.FC<TransitionPresentationComponentProps<ZoomProps>> = ({
    children, presentationProgress, presentationDirection,
}) => {
    const entering = presentationDirection === "entering";
    const scale = entering
        ? interpolate(presentationProgress, [0, 1], [1.06, 1])   // новый «выплывает» из глубины
        : interpolate(presentationProgress, [0, 1], [1, 0.96]);  // старый чуть уходит назад
    const opacity = entering ? presentationProgress : 1 - presentationProgress;
    const blur = entering
        ? interpolate(presentationProgress, [0, 1], [8, 0])
        : interpolate(presentationProgress, [0, 1], [0, 8]);
    return (
        <AbsoluteFill style={{ opacity, transform: `scale(${scale})`, filter: `blur(${blur}px)` }}>
            {children}
        </AbsoluteFill>
    );
};

export const zoomThrough = (): TransitionPresentation<ZoomProps> => ({
    component: ZoomPresentation,
    props: {},
});