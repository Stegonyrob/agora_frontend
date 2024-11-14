import CardText from "../Components/Card/CardText";
import styles from './scss/Views.module.scss';
export default function AgoraView() {
  return (
    <div className={styles.container}>
      <h2>Ágora</h2>
      <CardText ids={['1', '2']} />

    </div>
  );
}
