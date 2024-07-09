import { fireEvent, render, waitFor } from "@testing-library/react";
import api from "../../../services/profile.api";
import ProfileForm from "./ProfileForm";

jest.mock("../../../services/api");

describe("ProfileForm", () => {
  it("renders correctly", () => {
    const { getByText } = render(<ProfileForm />);
    expect(getByText("Formulario de Perfil")).toBeInTheDocument();
  });

  it("submits form data correctly", async () => {
    const { getByLabelText, getByText } = render(<ProfileForm />);
    const firstNameInput = getByLabelText("Nombre");
    const lastName1Input = getByLabelText("Primer Apellido");
    const lastName2Input = getByLabelText("Segundo Apellido");
    const relationshipInput = getByLabelText("Parentesco");
    const emailInput = getByLabelText("Email address");
    const cityInput = getByLabelText("Ciudad");
    const submitButton = getByText("Enviar");

    fireEvent.change(firstNameInput, { target: { value: "John" } });
    fireEvent.change(lastName1Input, { target: { value: "Doe" } });
    fireEvent.change(lastName2Input, { target: { value: "Smith" } });
    fireEvent.change(relationshipInput, { target: { value: "Padre" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(cityInput, { target: { value: "New York" } });

    fireEvent.click(submitButton);

    await waitFor(() => expect(api.profileUser).toHaveBeenCalledTimes(1));
    expect(api.profileUser).toHaveBeenCalledWith({
      avatar: "",
      firstName: "John",
      lastName1: "Doe ",
      lastName2: "Smith",
      relationship: "Padre",
      email: "john@example.com",
      city: "New York",
      userId: "", // Add a check to ensure userId is not undefined
    });
  });
});
