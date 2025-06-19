import CardText from "../Components/Card/text/CardText";
import styles from './scss/Views.module.scss';
export default function CeaView() {
  return (
    <div className={styles.container}>
      <h2 className={styles.centeredTitle}>Condición del Espectro Autista</h2>
      <CardText ids={['14', '15']} endpoint={""} />
    </div>
  );
}
