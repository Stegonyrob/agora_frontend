
import PropTypes from "prop-types";
import { Row } from "react-bootstrap";

import styles from './TextBody.module.scss';

interface TextProps {

    title: string;
    message: string;
    tags: string;
}


const Text: React.FC<TextProps> = ({ title, message, tags }) => {
    return (
        <div>
            <Row>

                <h2 className={styles.title}>{title}</h2>
                <div className={styles.message}>
                    <p className="text-sm text-justify">
                        {message}
                    </p>
                    <p className={styles.tags}>
                        {tags}
                    </p>


                </div>

            </Row>
        </div >

    );
}
Text.propTypes = {
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
};

Text.defaultProps = {
    title: "Algo Pasó",
    message: "Bienvenidos a Ágora Centro Educativo de Apoyo Especializado",
};

export default Text;