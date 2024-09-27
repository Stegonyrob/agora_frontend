import PropTypes from "prop-types";

interface InteractionAdmin {
    icon: string;
    alt: string;
    count: number;
    interact: () => void;
    color: string;
}

const InteractionAdmin = ({ icon, alt, count, interact, color }: InteractionAdmin) => (
    <span className="flex w-8">
        <img src={icon}
            alt={alt}
            className="cursor-pointer"
            onClick={interact} />
        <p style={{ color: color }} className="ml-1 font-semibold text-sm">{count}</p>
    </span>
)

InteractionAdmin.propTypes = {
    icon: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    count: PropTypes.number,
    interact: PropTypes.func.isRequired,
    color: PropTypes.string.isRequired,
};

InteractionAdmin.defaultProps = {
    count: 0, // No debería ser un string vacío, sino un número
    alt: "icon",
    interact: () => { }, // Deberías proporcionar un valor por defecto para interact
    color: "", // Deberías proporcionar un valor por defecto para color
};

export default InteractionAdmin