import { useTexts } from "@/hooks/useTexts";
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
  const texts = useTexts(category);

  return (
    <div className={styles.container}>

      <CardText texts={texts} category={category} />
    </div>
  );
}
