import { InfinityIcon } from "./Icons";

const GrayScaleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <span style={{ filter: "grayscale(100%)" }}>
        <InfinityIcon {...props} />
    </span>
);

export default GrayScaleIcon;