import RegisterForm from "../Components/Register/RegisterForm";
import styles from './scss/Views.module.scss';
export default function RegisterView() {
  return (
    <div className={styles.container}>
      <RegisterForm />

    </div>
  );
}
