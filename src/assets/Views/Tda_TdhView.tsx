import CardText from "../Components/Card/text/CardText";
import styles from './scss/Views.module.scss';

export default function TdaTdhView() {
  return (
    <div className={styles.centeredTitle}>

      <CardText ids={['16', '17']} endpoint={""} />
    </div>
  );
}
