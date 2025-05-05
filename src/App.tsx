import Footer from "@/assets/Components/Footer/Footer";
import PrivateLayout from "@/routes/PrivateLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import PublicLayout from "@/routes/PublicLayout";
import React from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { SWRConfig } from "swr";
import swrConfig from "./swrConfig";

// Vistas públicas
import Error404View from "@/assets/Views/404View";
import AboutMeView from "@/assets/Views/AboutMeView";
import AgoraView from "@/assets/Views/AgoraView";
import CondicionesDesarrolloView from "@/assets/Views/CondDesarrolloView";
import DificultadAprendizajeView from "@/assets/Views/DifAprendizajeView";
import HomeView from "@/assets/Views/HomeView";
import LoginView from "@/assets/Views/LoginView";
import NeurodiversityView from "@/assets/Views/NeurodiversityView";
import RegisterView from "@/assets/Views/RegisterView";
import ServiceView from "@/assets/Views/ServiceView";
import Tda_TdhView from "@/assets/Views/Tda_TdhView";
import TeaView from "@/assets/Views/TeaView";

// Vistas privadas
import AdminView from "@/assets/Views/AdminView";
import BlogView from "@/assets/Views/BlogView";
import ProfileView from "@/assets/Views/ProfileView";

const App: React.FC = () => {
  return (
    <SWRConfig value={swrConfig}>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<HomeView />} />
            <Route path="aboutMe" element={<AboutMeView />} />
            <Route path="neurodiversity" element={<NeurodiversityView />} />
            <Route path="services" element={<ServiceView />} />
            <Route path="agora" element={<AgoraView />} />
            <Route path="cea" element={<TeaView />} />
            <Route path="tda_Tdh" element={<Tda_TdhView />} />
            <Route path="aprendizaje" element={<DificultadAprendizajeView />} />
            <Route path="desarrollo" element={<CondicionesDesarrolloView />} />
            <Route path="login" element={<LoginView />} />
            <Route path="register" element={<RegisterView />} />
            <Route path="*" element={<Error404View />} />
          </Route>

          {/* Rutas privadas */}
          <Route path="/blog" element={
            <PrivateLayout>
              <ProtectedRoute element={<BlogView />} />
            </PrivateLayout>
          }>
          </Route>
          <Route
            path="/admin"
            element={
              <PrivateLayout>
                <ProtectedRoute element={<AdminView />} />
              </PrivateLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateLayout>
                <ProtectedRoute element={<ProfileView posts={[]} />} />
              </PrivateLayout>
            }
          />

          {/* Redirección de logout */}
          <Route path="/logout" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Footer />
    </SWRConfig>
  );
};

export default App;