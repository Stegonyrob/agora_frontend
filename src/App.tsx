import Footer from "@/assets/Components/Footer/Footer";
import PrivateLayout from "@/routes/PrivateLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import PublicLayout from "@/routes/PublicLayout";
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import React, { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { SWRConfig } from "swr";
import swrConfig from "./swrConfig";
// Vistas públicas
import Error404View from "@/assets/Views/404View";
import AboutMeView from "@/assets/Views/AboutMeView";
import AgoraView from "@/assets/Views/AgoraView";
import HomeView from "@/assets/Views/HomeView";
import LoginView from "@/assets/Views/LoginView";
import NeurodiversityView from "@/assets/Views/NeurodiversityView";
import RegisterView from "@/assets/Views/RegisterView";
import ServiceView from "@/assets/Views/ServiceView";
import Tda_TdhView from "@/assets/Views/Tda_TdhView";

// Vistas privadas
import AdminView from "@/assets/Views/AdminView";
import BlogView from "@/assets/Views/BlogView";
import DevelopmentConditionsView from "@/assets/Views/DevelopmentConditionsView";
import LearningDifficultiesView from "@/assets/Views/LearningDifficultiesView";
import ProfileView from "@/assets/Views/ProfileView";
import { useDispatch } from "react-redux";
import AdminEventView from "./assets/Views/AdminEventView";
import EventsView from "./assets/Views/EventsView";



import CeaView from "@/assets/Views/CeaView";
import AdminPostView from "./assets/Views/AdminPostView";
import TermsView from "./assets/Views/TermsView";
import TrasComunicationView from './assets/Views/TrasCommunication';
import { IEvent } from "./core/events/IEvent";
import { login as setLogin } from "./redux/reducers/loginSlice";
const App: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      dispatch(setLogin({
        userId: Number(sessionStorage.getItem('userId')) || 0,
        role: sessionStorage.getItem('role') || "",
        accessToken: sessionStorage.getItem('accessToken') || "",
        refreshToken: sessionStorage.getItem('refreshToken') || "",
        userName: sessionStorage.getItem('userName') || ""
      }));
    }
  }, [dispatch, location.pathname]);

  return (
    <SWRConfig value={swrConfig}>

      <Routes>

        {/* Vista de error 404 */}
        {/* Rutas públicas */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomeView />} />
          <Route path="aboutMe" element={<AboutMeView />} />
          <Route path="neurodiversity" element={<NeurodiversityView />} />
          <Route path="services" element={<ServiceView />} />
          <Route path="agora" element={<AgoraView />} />
          <Route path="cea" element={<CeaView />} />
          <Route path="tda_Tdh" element={<Tda_TdhView />} />
          <Route path="learningDifficulties" element={<LearningDifficultiesView />} />
          <Route path="developmentConditions" element={<DevelopmentConditionsView />} />
          <Route path="login" element={<LoginView />} />
          <Route path="register" element={<RegisterView />} />
          <Route path="*" element={<Error404View />} />
          <Route path="communication" element={<TrasComunicationView />} />
          <Route path="events" element={<EventsView userId={null} events={[]} onSelect={function (event: IEvent): void {
            throw new Error("Function not implemented.");
          }} />} />
          <Route path="legal/:type" element={<TermsView />} />
        </Route>

        {/* Rutas privadas */}
        <Route path="/blog" element={
          <PrivateLayout>
            <ProtectedRoute element={<BlogView />} />
          </PrivateLayout>
        } />
        <Route path="/admin" element={
          <PrivateLayout>
            <ProtectedRoute element={<AdminView />} />
          </PrivateLayout>
        } />


        <Route path="/admin/posts" element={
          <PrivateLayout>
            <ProtectedRoute element={<AdminPostView userId={0} />} />
          </PrivateLayout>
        } />


        <Route path="/admin/events" element={
          <PrivateLayout>
            <ProtectedRoute element={<AdminEventView userId={0} />} />
          </PrivateLayout>
        } />


        <Route path="/profile" element={
          <PrivateLayout>
            <ProtectedRoute element={<ProfileView posts={[]} />} />
          </PrivateLayout>
        } />

        {/* Redirección de logout */}
        <Route path="/logout" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </SWRConfig>
  );
};

export default App;


