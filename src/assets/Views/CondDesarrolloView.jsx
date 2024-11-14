import CardText from "../Components/Card/CardText";
import styles from "./scss/Views.module.scss";
export default function CondicionesDesarrolloView() {
  return (
    <div className={styles.container}>
      <h2>Condiciones del Desarrollo</h2>
      <CardText ids={["13", "14"]} />
    </div>
  );
}
