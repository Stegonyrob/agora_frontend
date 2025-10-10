import axios from "axios";
import IUser from "../user/IUser";
import IRegisterDTO from "./IRegisterDTO";

// RegisterService.ts
export class RegisterService {
  private uri: string = import.meta.env.VITE_API_ENDPOINT_REGISTER;
  async register(registerData: IRegisterDTO): Promise<IUser> {
    // Validación obligatoria: el usuario debe haber aceptado las reglas
    if (!registerData.rulesAccepted) {
      throw new Error(
        "Debes aceptar las reglas de la comunidad para poder registrarte."
      );
    }

    // Debug: Log de los datos que se van a enviar
    console.log(
      "📤 Enviando datos de registro:",
      JSON.stringify(registerData, null, 2)
    );


    try {

      const res = await axios.post(this.uri, registerData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("📡 Response completo:", {
        status: res.status,
        statusText: res.statusText,
        headers: res.headers,
        data: res.data,
      });
      return res.data;
    } catch (error) {
      console.error("🔥 Error completo:", error);
      if (axios.isAxiosError(error)) {
        console.error("❌ Error de registro:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers,
          url: this.uri,
          sentData: registerData,
        });

        // Log del request que se intentó enviar
        console.error("📤 Request config:", error.config);
      }
      throw error;
    }
  }
}
