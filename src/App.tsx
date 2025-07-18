import Footer from "@/assets/Components/Footer/Footer";
import { updateAvatarUrl } from "@/core/auth/sessionStore";
import { fetchAvatarsForSelector } from "@/core/avatars/avatarStore";
import { fetchProfileById } from "@/core/profiles/profileStore";
import { RootState } from "@/redux/store";
import PrivateLayout from "@/routes/PrivateLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import PublicLayout from "@/routes/PublicLayout";
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { SWRConfig } from "swr";
import { useFontSize } from "./hooks/useFontSize";
import swrConfig from "./swrConfig";

// Vistas públicas
import Error404View from "@/assets/Views/404View";
import AboutMeView from "@/assets/Views/AboutMeView";
import AgoraView from "@/assets/Views/AgoraView";
import CeaView from "@/assets/Views/CeaView";
import DevelopmentConditionsView from "@/assets/Views/DevelopmentConditionsView";
import HomeView from "@/assets/Views/HomeView";
import LearningDifficultiesView from "@/assets/Views/LearningDifficultiesView";
import LoginView from "@/assets/Views/LoginView";
import NeurodiversityView from "@/assets/Views/NeurodiversityView";
import RegisterView from "@/assets/Views/RegisterView";
import ServiceView from "@/assets/Views/ServiceView";
import Tda_TdhView from "@/assets/Views/Tda_TdhView";
import AdminPostView from "./assets/Views/AdminPostView";
import EventsView from "./assets/Views/EventsView";
import TrasComunicationView from './assets/Views/TrasCommunication';
// Vistas privadas
import AdminView from "@/assets/Views/AdminView";
import BlogView from "@/assets/Views/BlogView";

import ResetPasswordPage from "@/assets/Components/Login/ResetPasswordPage";
import ProfileView from "@/assets/Views/ProfileView";
import AdminEventView from "./assets/Views/AdminEventView";
import AdminLegalTextView from "./assets/Views/AdminLegalTextView";
import AdminUsersView from "./assets/Views/AdminUsersView";
import LegalTextView from "./assets/Views/LegalTextView";






const App: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const session = useSelector((state: RootState) => state.session);
  // DEBUG: Avatars global state
  const avatars = useSelector((state: RootState) => state.avatars?.avatars || []);
  // Log avatars state on every render
  console.log('[App] Avatars state:', avatars);
  // Nuevo estado para controlar la hidratación
  const [isHydrating, setIsHydrating] = useState(true);

  // Initialize font size hook
  const { fontSize } = useFontSize();

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      const userId = Number(sessionStorage.getItem('userId')) || 0;
      const role = sessionStorage.getItem('role') || "";
      const accessToken = sessionStorage.getItem('accessToken') || "";
      const refreshToken = sessionStorage.getItem('refreshToken') || "";
      const userName = sessionStorage.getItem('userName') || "";
      const useremail = sessionStorage.getItem('useremail') || "";
      const viewAsUser = sessionStorage.getItem('viewAsUser') === 'true';

      dispatch({
        type: "session/login",
        payload: {
          userId,
          role,
          accessToken,
          refreshToken,
          userName,
          useremail,
          isLoggedIn,
          viewAsUser,
        }
      });

      // Cargar perfil y actualizar avatarUrl en sesión
      (dispatch as any)(fetchProfileById(userId)).then((result: any) => {
        const profile = result?.payload;
        if (profile && profile.avatar) {
          dispatch(updateAvatarUrl(profile.avatar));
        }
      });
    }
    // Cargar avatares globales al iniciar la app
    dispatch(fetchAvatarsForSelector() as any);
    setIsHydrating(false); // Ya terminamos de hidratar
  }, [dispatch, location.pathname]);

  useEffect(() => {
    sessionStorage.setItem("isLoggedIn", String(session.isLoggedIn));
    sessionStorage.setItem("userId", String(session.userId));
    sessionStorage.setItem("role", session.role || "");
    sessionStorage.setItem("accessToken", session.accessToken || "");
    sessionStorage.setItem("refreshToken", session.refreshToken || "");
    sessionStorage.setItem("userName", session.userName || "");
    sessionStorage.setItem("useremail", session.useremail || "");
    sessionStorage.setItem("viewAsUser", String(session.viewAsUser));
  }, [session]);

  const expiresAt = Number(sessionStorage.getItem('sessionExpiresAt'));
  useEffect(() => {
    if (expiresAt && Date.now() > expiresAt) {
      dispatch({ type: "session/logout" });
      sessionStorage.clear();
      navigate('/login', { replace: true });
    }
  }, [expiresAt, dispatch, navigate]);

  // NO RENDERICES rutas protegidas hasta que termine la hidratación
  if (isHydrating) {
    return <div>Cargando sesión...</div>;
  }
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
          <Route path="events" element={
            <EventsView
              userId={session.userId || 0}
              events={[]}
              onSelect={() => { }}
            />
          } />
          <Route path="legal/:type" element={<LegalTextView />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
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
            <ProtectedRoute element={<AdminPostView userId={session.userId || 0} />} />
          </PrivateLayout>
        } />

        <Route path="/admin/events" element={
          <PrivateLayout>
            <ProtectedRoute element={<AdminEventView userId={session.userId || 0} />} />
          </PrivateLayout>
        } />

        <Route path="/admin/legal/:type" element={
          <PrivateLayout>
            <ProtectedRoute element={<AdminLegalTextView />} />
          </PrivateLayout>
        } />

        <Route path="/admin/users" element={
          <PrivateLayout>
            <ProtectedRoute element={<AdminUsersView />} />
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


