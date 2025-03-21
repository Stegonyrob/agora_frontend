interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

class ContactService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = "http://localhost:8080/api/contact"; // Cambia la URL si es necesario
  }

  async sendContactForm(data: ContactFormData): Promise<void> {
    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Error al enviar el formulario de contacto");
      }
    } catch (error) {
      console.error("Error en ContactService:", error);
      throw error;
    }
  }
}

export default new ContactService();
