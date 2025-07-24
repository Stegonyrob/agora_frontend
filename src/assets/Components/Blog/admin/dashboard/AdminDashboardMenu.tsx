import React, { useEffect, useState } from "react";
import DashboardSkeleton from "./DashboardSkeleton";
import NavigationMenu, { NavMenuItem } from "./NavigationMenu";

const adminMenuItems: NavMenuItem[] = [
    { key: "home-admin", label: "Inicio", path: "/", background: "/images/bg-home.jpg" },
    { key: "home-user", label: "Home", path: "/", background: "/images/bg-home.jpg", viewAsUser: true },
    { key: "agora-admin", label: "Ágora", path: "/agora", background: "/images/bg-agora.jpg", role: "ROLE_ADMIN", viewAsUser: false },
    { key: "agora-user", label: "Ágora", path: "/agora", background: "/images/bg-agora-user.jpg", viewAsUser: true },
    { key: "aboutme-admin", label: "Sobre Mi", path: "/aboutMe", background: "/images/bg-aboutme.jpg", role: "ROLE_ADMIN", viewAsUser: false },
    { key: "aboutme-user", label: "Sobre Mi", path: "/aboutMe", background: "/images/bg-aboutme-user.jpg", viewAsUser: true },
    { key: "servicios-admin", label: "Servicios", path: "/services", background: "/images/bg-services.jpg", role: "ROLE_ADMIN", viewAsUser: false },
    { key: "servicios-user", label: "Servicios", path: "/services", background: "/images/bg-services-user.jpg", viewAsUser: true },
    { key: "neurodiversidad-admin", label: "Neurodiversidad", path: "/neurodiversity", background: "/images/bg-neuro.jpg", role: "ROLE_ADMIN", viewAsUser: false },
    { key: "neurodiversidad-user", label: "Neurodiversidad", path: "/neurodiversity", background: "/images/bg-neuro-user.jpg", viewAsUser: true },
    { key: "cea-admin", label: "CEA/TEA", path: "/cea", background: "/images/bg-tea.jpg", role: "ROLE_ADMIN", viewAsUser: false },
    { key: "cea-user", label: "CEA/TEA", path: "/cea", background: "/images/bg-tea-user.jpg", viewAsUser: true },
    { key: "tda-admin", label: "TDA/TDH", path: "/tda_Tdh", background: "/images/bg-tdath.jpg", role: "ROLE_ADMIN", viewAsUser: false },
    { key: "tda-user", label: "TDA/TDH", path: "/tda_Tdh", background: "/images/bg-tdath-user.jpg", viewAsUser: true },
    { key: "dificultades-admin", label: "Dificultades Aprendizaje", path: "/learningDifficulties", background: "/images/bg-learning.jpg", role: "ROLE_ADMIN", viewAsUser: false },
    { key: "dificultades-user", label: "Dificultades Aprendizaje", path: "/learningDifficulties", background: "/images/bg-learning-user.jpg", viewAsUser: true },
    { key: "condiciones-admin", label: "Condiciones Desarrollo", path: "/developmentConditions", background: "/images/bg-development.jpg", role: "ROLE_ADMIN", viewAsUser: false },
    { key: "condiciones-user", label: "Condiciones Desarrollo", path: "/developmentConditions", background: "/images/bg-development-user.jpg", viewAsUser: true },
    { key: "eventos-admin", label: "Eventos", path: "/admin/events", background: "/images/bg-events.jpg", role: "ROLE_ADMIN", viewAsUser: false },
    { key: "eventos-user", label: "Eventos", path: "/events", background: "/images/bg-events-user.jpg", viewAsUser: true },
    { key: "blog-admin", label: "Blog", path: "/admin/posts", background: "/images/bg-blog.jpg", role: "ROLE_ADMIN", viewAsUser: false },
    { key: "blog-user", label: "Blog", path: "/blog", background: "/images/bg-blog-user.jpg", viewAsUser: true },
    { key: "perfil-admin", label: "Perfil", path: "/profile", background: "/images/bg-profile.jpg", role: "ROLE_ADMIN", viewAsUser: false },
    { key: "perfil-user", label: "Perfil", path: "/profile", background: "/images/bg-profile-user.jpg", viewAsUser: true },
    { key: "usuarios-admin", label: "Listado de Usuarios", path: "/admin/users", background: "/images/bg-users.jpg", role: "ROLE_ADMIN", viewAsUser: false },
    { key: "terminos-admin", label: "Términos", path: "/legal/terms", background: "/images/bg-terms.jpg", role: "ROLE_ADMIN", viewAsUser: false },
    { key: "terminos-user", label: "Términos", path: "/legal/terms", background: "/images/bg-terms-user.jpg", viewAsUser: true },
    { key: "privacidad-admin", label: "Privacidad", path: "/admin/legal/privacy", background: "/images/bg-privacy.jpg", role: "ROLE_ADMIN", viewAsUser: false },
    { key: "privacidad-user", label: "Privacidad", path: "/legal/privacy", background: "/images/bg-privacy-user.jpg", viewAsUser: true },
    { key: "cookies-admin", label: "Cookies", path: "/admin/legal/cookies", background: "/images/bg-cookies.jpg", role: "ROLE_ADMIN", viewAsUser: false },
    { key: "cookies-user", label: "Cookies", path: "/legal/cookies", background: "/images/bg-cookies-user.jpg", viewAsUser: true },
    { key: "reglas-blog-admin", label: "Reglas Blog", path: "/admin/blog-rules", background: "/images/bg-blogrules.jpg", role: "ROLE_ADMIN", viewAsUser: false },
    { key: "reglas-blog-preview", label: "Reglas Blog", path: "/blog-rules-preview", background: "/images/bg-blogrules-preview.jpg", viewAsUser: true },
];




const AdminDashboardMenu: React.FC = () => {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 6000);
        return () => clearTimeout(timer);
    }, []);
    if (loading) {
        return <DashboardSkeleton />;
    }
    return <NavigationMenu items={adminMenuItems} />;
};

export default AdminDashboardMenu;
