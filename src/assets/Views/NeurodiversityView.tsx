
import CardText from "../Components/Card/text/CardText";
import styles from './scss/Views.module.scss';
export default function NeurodiversityView() {
  return (
    <div className={styles.container}>
      <h2 className={styles.centeredTitle}>Neurodiversidad</h2>
      <CardText ids={['12', '13']} endpoint={""} />
    </div>
  );
}
