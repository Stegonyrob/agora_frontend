import CardText from "../Components/Card/text/CardText";
import styles from './scss/Views.module.scss';
export default function AgoraView() {
  return (
    <div className={styles.container}>
      <h2 className={styles.centeredTitle}>Ágora Centro Educativo de Apoyo Especializado</h2>
      <CardText ids={['1', '2']} endpoint={""} />

    </div>
  );
}
