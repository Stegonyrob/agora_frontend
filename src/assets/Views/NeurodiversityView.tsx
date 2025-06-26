
import CardText from "../Components/Card/text/CardText";
import styles from './scss/Views.module.scss';
export default function NeurodiversityView() {
  return (
    <div className={styles.container}>

      <CardText ids={['12', '13']} endpoint={""} />
    </div>
  );
}
