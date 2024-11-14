
import CardText from "../Components/Card/CardText";
import styles from './scss/Views.module.scss';
export default function NeurodiversityView() {
  return (
    <div className={styles.container}>
      <h2>Neurodiversidad</h2>
      <CardText ids={['5', '6']} />
    </div>
  );
}
