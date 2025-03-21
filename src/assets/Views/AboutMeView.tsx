
import CardText from "../Components/Card/CardText";
import ContactForm from "../Components/ContactMe/ContactForm";
import styles from './scss/Views.module.scss';
const AboutMeView = () => {
  return (
    <div className={styles.container}>
      <CardText ids={['15']} />
      <ContactForm />
    </div>
  );
};

export default AboutMeView;
