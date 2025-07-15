import React from "react";
import { useSearchParams } from "react-router-dom";
import ResetPasswordForm from "./ResetPasswordForm";
import { loginRepository } from "./loginRepository";

const ResetPasswordPage: React.FC = () => {
    const [params] = useSearchParams();
    const token = params.get("token") || "";

    const handleReset = async (token: string, newPassword: string) => {
        // Detectar si es admin por el token o por la URL si lo necesitas
        await loginRepository.resetPassword(token, newPassword);
    };

    return <ResetPasswordForm token={token} onReset={handleReset} />;
};

export default ResetPasswordPage;
