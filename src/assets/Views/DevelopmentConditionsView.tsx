import CardText from "../Components/Card/text/CardText";
import styles from "./scss/Views.module.scss";
export default function CondicionesDesarrolloView() {
  return (
    <div className={styles.container}>

      <CardText ids={["20", "21"]} endpoint={""} />
    </div>
  );
}
