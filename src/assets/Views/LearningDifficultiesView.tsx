
import CardText from "../Components/Card/text/CardText";
import styles from './scss/Views.module.scss';
export default function DiciultadAprendizajeView() {
  return (
    <div className={styles.container}>
      <h2 className={styles.centeredTitle}>Dificultades en el Aprendizaje</h2>
      <CardText ids={['11', '12']} endpoint={""} />
    </div>
  );
}
