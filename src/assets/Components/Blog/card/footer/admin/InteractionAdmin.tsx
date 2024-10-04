import PropTypes from "prop-types";
import styles from './FooterAdmin.module.scss';
interface InteractionAdminCount {
    icon: string;
    alt: string;
    count: number;
    interact: () => void;
    color: string;
}


interface InteractionAdmin {
    icon: string;
    alt: string;
    interact: () => void;

}
const InteractionAdminCount = ({ icon, alt, count = 580, interact, color }: InteractionAdminCount) => (
    <span className="flex w-8">
        <img src={icon}
            alt={alt}
            className={styles.icon}
            onClick={interact} />
        <p style={{ color: color }} className="ml-1 font-semibold text-sm">{count}</p>
    </span>
)

InteractionAdminCount.propTypes = {
    icon: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    count: PropTypes.number,
    interact: PropTypes.func.isRequired,
    color: PropTypes.string.isRequired,
};

InteractionAdminCount.defaultProps = {
    count: 0, // No debería ser un string vacío, sino un número
    alt: "icon",
    interact: () => { }, // Deberías proporcionar un valor por defecto para interact
    color: "", // Deberías proporcionar un valor por defecto para color
};


const InteractionAdmin = ({ icon, alt, interact }: InteractionAdmin) => (
    <span className="flex w-8">
        <img src={icon}
            alt={alt}
            className={styles.icon}
            onClick={interact} />

    </span>
)

InteractionAdmin.propTypes = {
    icon: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,

    interact: PropTypes.func.isRequired,

};

InteractionAdmin.defaultProps = {

    alt: "icon",
    interact: () => { }, // Deberías proporcionar un valor por defecto para interact

};
export { InteractionAdmin, InteractionAdminCount };
