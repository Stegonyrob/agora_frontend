export default interface IRegisterDTO {
  username: string;
  email: string;
  password: string;
  rulesAccepted: boolean; // Campo obligatorio para confirmar aceptación de reglas
}
