import CardText from "../Components/Card/text/CardText";
import styles from './scss/Views.module.scss';

export default function TrasCommunicationView() {
    return (
        <div className={styles.container}>
            <h2>Trastorno de la Comunicación</h2>
            <CardText ids={['14', '15']} endpoint={""} />
        </div>
    );
}
