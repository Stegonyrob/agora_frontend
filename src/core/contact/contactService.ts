interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

class ContactService {
  private readonly apiUrl: string;

  constructor() {
    this.apiUrl = import.meta.env.VITE_API_ENDPOINT_CONTACT;
  }

  async sendContactForm(data: ContactFormData): Promise<void> {
    if (!data) {
      throw new Error("No data provided for contact form submission");
    }

    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        "Error al enviar el formulario de contacto: " + errorText,
      );
    }
  }
}

export default new ContactService();
