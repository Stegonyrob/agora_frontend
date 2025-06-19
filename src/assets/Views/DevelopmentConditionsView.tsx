import CardText from "../Components/Card/text/CardText";
import styles from "./scss/Views.module.scss";
export default function CondicionesDesarrolloView() {
  return (
    <div className={styles.container}>
      <h2 className={styles.centeredTitle}>Condiciones del Desarrollo</h2>
      <CardText ids={["20", "21"]} endpoint={""} />
    </div>
  );
}
