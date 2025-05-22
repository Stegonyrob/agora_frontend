import CardText from "../Components/Card/text/CardText";
import styles from './scss/Views.module.scss';
export default function TeaView() {
  return (
    <div className={styles.container}>
      <h2>Condición del Espectro Autista</h2>
      <CardText ids={['7', '8']} />
    </div>
  );
}
