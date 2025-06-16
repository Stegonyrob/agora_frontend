import CardText from "../Components/Card/text/CardText";
import styles from './scss/Views.module.scss';

export default function TdaTdhView() {
  return (
    <div className={styles.centeredTitle}>
      <h2>Trastorno de Deficit de Atención con y sin Hiperactividad Tda/Tdh</h2>
      <CardText ids={['10', '11']} endpoint={""} />
    </div>
  );
}
