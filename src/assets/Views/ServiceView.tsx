import CardText from "../Components/Card/text/CardText";
import styles from './scss/Views.module.scss';
export default function ServiceView() {
  return (
    <div className={styles.container}>
      <h2>Nuestros Servicios</h2>
      <CardText ids={['3', '4', '5', '6', '7', '8', '9']} endpoint={""} />
    </div>
  );
}
