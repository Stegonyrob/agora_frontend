import React from "react";
import { useSearchParams } from "react-router-dom";
import { LoginRepository } from "../../../core/auth/LoginRepository";
import ResetPasswordForm from "./ResetPasswordForm";

const ResetPasswordPage: React.FC = () => {
    const [params] = useSearchParams();
    const token = params.get("token") || "";

    const handleReset = async (token: string, newPassword: string) => {
        // Detectar si es admin por el token o por la URL si lo necesitas
        await LoginRepository.resetPassword(token, newPassword);
    };

    return <ResetPasswordForm token={token} onReset={handleReset} />;
};

export default ResetPasswordPage;
