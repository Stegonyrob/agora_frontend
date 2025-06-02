import { LegalTextDTO } from "@/core/legals/LegalTextDTO";
const uri = import.meta.env.VITE_API_ENDPOINT_LEGAL;

export class LegalTextService {
  // 1. Get all texts - fetchTexts()
  async fetchLegalTexts(type: string): Promise<LegalTextDTO[]> {
    const res = await fetch(`${uri}/${type}`);
    if (!res.ok) throw new Error("No se pudo cargar el texto legal");
    return await res.json();
  }

  // 2. Get text by ID - fetchTextById()

  async getLegalTextByType(type: string): Promise<LegalTextDTO> {
    const response = await fetch(`/api/v1/legal/${type}`);
    if (!response.ok) throw new Error("No encontrado");
    return response.json();
  }

  // 3. Create text - createText()
  async createLegalText(newText: LegalTextDTO): Promise<LegalTextDTO> {
    const userRole = await this.getUserRole();
    if (userRole !== "admin")
      throw new Error("Solo el administrador puede crear textos legales");
    const res = await fetch(`${uri}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newText),
    });
    if (!res.ok) throw new Error("No se pudo crear el texto legal");
    return await res.json();
  }

  // 4. Update text - updateText()
  async updateLegalText(
    id: number,
    updatedText: LegalTextDTO
  ): Promise<LegalTextDTO> {
    const userRole = await this.getUserRole();
    if (userRole !== "admin")
      throw new Error("Solo el administrador puede actualizar textos legales");
    const res = await fetch(`${uri}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedText),
    });
    if (!res.ok) throw new Error("No se pudo actualizar el texto legal");
    return await res.json();
  }

  // 5. Delete text - deleteText()
  async deleteLegalText(id: number): Promise<void> {
    const userRole = await this.getUserRole();
    if (userRole !== "admin")
      throw new Error("Solo el administrador puede eliminar textos legales");
    const res = await fetch(`${uri}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("No se pudo eliminar el texto legal");
  }

  // 6. Get user role - getUserRole()
  private async getUserRole(): Promise<string> {
    // Assume this function correctly fetches the user's role
    return "admin"; // Replace with actual role fetching logic
  }
}
