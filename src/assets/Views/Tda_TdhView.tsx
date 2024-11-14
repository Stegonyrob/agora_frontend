import CardText from "../Components/Card/CardText";
import styles from './scss/Views.module.scss';

export default function TdaTdhView() {
  return (
    <div className={styles.container}>
      <h2>Trastorno de Deficit de Atención con y sin Hiperactividad Tda/Tdh</h2>
      <CardText ids={['9', '10']} />
    </div>
  );
}
