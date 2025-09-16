import { useParams } from "react-router-dom";
import CardText from "../Components/Card/text/CardText";
import styles from './scss/Views.module.scss';

const titleMap: Record<string, string> = {
  nosotros: "Sobre Nosotros",
  servicios: "Nuestros Servicios",
  neurodiversidad: "Neurodiversidad",
  desarrollo: "Desarrollo",
  comunicacion: "Comunicación",
};

export default function AgoraView() {
  const { category } = useParams<{ category?: string }>();

  return (
    <div className={styles.container}>
      <CardText category={category} />
    </div>
  );
}
