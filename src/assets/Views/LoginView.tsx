import FormLogin from '../Components/Login/FormLogin';
import styles from './scss/Views.module.scss';
export default function LoginView() {
  return (
    <div className={styles.container}>
      <FormLogin setLogin={function (value: boolean): void {
        throw new Error('Function not implemented.');
      }} setRegister={function (value: boolean): void {
        throw new Error('Function not implemented.');
      }} setUserId={function (value: string): void {
        throw new Error('Function not implemented.');
      }} setUserName={function (value: string): void {
        throw new Error('Function not implemented.');
      }} setRole={function (value: string): void {
        throw new Error('Function not implemented.');
      }} />
    </div>
  );
}
