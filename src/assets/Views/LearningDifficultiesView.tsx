
import CardText from "../Components/Card/CardText";
import styles from './scss/Views.module.scss';
export default function DiciultadAprendizajeView() {
  return (
    <div className={styles.container}>
      <h2>Dificultades en el Aprendizaje</h2>
      <CardText ids={['11', '12']} />
    </div>
  );
}
