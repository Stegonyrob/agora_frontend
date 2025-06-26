import CardText from "../Components/Card/text/CardText";
import styles from './scss/Views.module.scss';

export default function TrasCommunicationView() {
    return (
        <div className={styles.container}>

            <CardText ids={['22', '23']} endpoint={""} />
        </div>
    );
}
