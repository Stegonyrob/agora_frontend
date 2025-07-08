interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

class ContactService {
  private apiUrl: string;

  constructor() {
    console.log("Initializing ContactService constructor");
    this.apiUrl = import.meta.env.VITE_API_ENDPOINT_CONTACT;
    console.log("API URL set to:", this.apiUrl);
  }

  async sendContactForm(data: ContactFormData): Promise<void> {
    if (!data) {
      throw new Error("No data provided for contact form submission");
    }

    console.log("Sending contact form data:", data);

    try {
      console.log("Calling fetch with:", this.apiUrl);
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        console.log("Error response is not OK. Getting error text.");
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(
          "Error al enviar el formulario de contacto: " + errorText
        );
      }

      console.log("Contact form sent successfully.");
    } catch (error) {
      console.error(
        "Error en ContactService:",
        error instanceof Error ? error.message : error
      );
      throw error;
    }
  }
}

export default new ContactService();
