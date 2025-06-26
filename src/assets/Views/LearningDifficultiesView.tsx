
import CardText from "../Components/Card/text/CardText";
import styles from './scss/Views.module.scss';
export default function DiciultadAprendizajeView() {
  return (
    <div className={styles.container}>

      <CardText ids={['18', '19']} endpoint={""} />
    </div>
  );
}
