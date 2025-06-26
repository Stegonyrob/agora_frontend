import CardText from "../Components/Card/text/CardText";
import styles from './scss/Views.module.scss';
export default function CeaView() {
  return (
    <div className={styles.container}>

      <CardText ids={['14', '15']} endpoint={""} />
    </div>
  );
}
