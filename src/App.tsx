import { updateAvatarUrl } from "@/core/auth/sessionStore";
import { fetchAvatarsForSelector } from "@/core/avatars/avatarStore";
import { fetchProfileById } from "@/core/profiles/profileStore";
import { fetchTexts } from "@/core/texts/textStore";
import { RootState } from "@/redux/store";
import PrivateLayout from "@/routes/PrivateLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import PublicLayout from "@/routes/PublicLayout";
import { lazy, Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { SWRConfig } from "swr";
import { useColorBlindMode } from "./hooks/useColorBlindMode";
import { useFontSize } from "./hooks/useFontSize";
import { useHighContrast } from "./hooks/useHighContrast";
import swrConfig from "./swrConfig";
// 🛡️ Error Boundary para capturar errores
import ErrorBoundary from "./assets/Components/Error/ErrorBoundary";
// 📝 Logger para logging estructurado
import { logger } from "./core/logging/LoggerService";

import { es } from 'date-fns/locale';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
// date-fns
// or for dayjs
// or for luxon
// or for moment

registerLocale('es', es);
setDefaultLocale('es');

const Error404View = lazy(() => import("@/assets/Views/404View"));
const Footer = lazy(() => import("@/assets/Components/Footer/Footer"));
const AgoraView = lazy(() => import("@/assets/Views/AgoraView"));
const HomeView = lazy(() => import("@/assets/Views/HomeView"));
const LoginView = lazy(() => import("@/assets/Views/LoginView"));
const ResetPasswordPage = lazy(() => import("@/assets/Components/Login/ResetPasswordPage"));
const RegisterView = lazy(() => import("@/assets/Views/RegisterView"));
const EventsView = lazy(() => import("./assets/Views/EventsView"));
const LegalTextView = lazy(() => import("./assets/Views/LegalTextView"));
const BlogView = lazy(() => import("@/assets/Views/BlogView"));
const AdminView = lazy(() => import("@/assets/Views/AdminView"));
const AdminPostView = lazy(() => import("@/assets/Views/AdminPostView"));
const AdminEventView = lazy(() => import("@/assets/Views/AdminEventView"));
const AdminLegalTextView = lazy(() => import("@/assets/Views/AdminLegalTextView"));
const AdminUsersView = lazy(() => import("@/assets/Views/AdminUsersView"));
const AdminTextView = lazy(() => import("@/assets/Views/AdminTextView"));
const ProfileView = lazy(() => import("@/assets/Views/ProfileView"));
const FaqView = lazy(() => import("@/assets/Views/FaqView"));





const App: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const session = useSelector((state: RootState) => state.session);

  // Nuevo estado para controlar la hidratación
  const [isHydrating, setIsHydrating] = useState(true);

  // Initialize font size, color blind mode and high contrast hooks (only for side effects)
  useFontSize();
  useColorBlindMode();
  useHighContrast();

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
      const avatarUrl = sessionStorage.getItem('avatarUrl') || "";

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

      // Si tenemos avatarUrl en sessionStorage, cargarlo inmediatamente
      if (avatarUrl) {
        dispatch(updateAvatarUrl(avatarUrl));
      }

      // Cargar perfil y actualizar avatarUrl en sesión
      (dispatch as any)(fetchProfileById(userId)).then((result: any) => {
        const profile = result?.payload;
        if (profile?.avatar) {
          dispatch(updateAvatarUrl(profile.avatar));
          // También almacenar en sessionStorage para persistencia
          sessionStorage.setItem('avatarUrl', profile.avatar);
        }
      });

      // Solo cargar avatares si el usuario está autenticado
      dispatch(fetchAvatarsForSelector() as any);
    }
    // Cargar textos en el store redux al iniciar la app
    dispatch(fetchTexts() as any);
    setIsHydrating(false); // Ya terminamos de hidratar
  }, [dispatch]);

  useEffect(() => {
    sessionStorage.setItem("isLoggedIn", String(session.isLoggedIn));
    sessionStorage.setItem("userId", String(session.userId));
    sessionStorage.setItem("role", session.role || "");
    sessionStorage.setItem("accessToken", session.accessToken || "");
    sessionStorage.setItem("refreshToken", session.refreshToken || "");
    sessionStorage.setItem("userName", session.userName || "");
    sessionStorage.setItem("useremail", session.useremail || "");
    sessionStorage.setItem("viewAsUser", String(session.viewAsUser));
    // También guardar el avatarUrl cuando cambie en la sesión
    if (session.avatarUrl) {
      sessionStorage.setItem("avatarUrl", session.avatarUrl);
    }
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

  // 📝 Log del renderizado de la aplicación
  logger.debug('App: Renderizando aplicación principal', {
    isLoggedIn: session.isLoggedIn,
    userId: session.userId,
    role: session.role,
    pathname: location.pathname
  }, {
    component: 'App'
  });

  return (
    <ErrorBoundary>
      <SWRConfig value={swrConfig}>
        <Suspense fallback={<div>Cargando vista...</div>}>
          <Routes>
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<HomeView />} />
              <Route path="team" element={<Navigate to="/agora/team" replace />} />
              <Route path="agora/:category" element={<AgoraView />} />
              <Route path="register" element={<RegisterView />} />
              <Route path="login" element={<LoginView />} />
              <Route path="*" element={<Error404View />} />
              <Route
                path="events"
                element={<EventsView userId={session.userId || 0} events={[]} onSelect={() => undefined} />}
              />
              <Route path="legal/:type" element={<LegalTextView />} />
              <Route path="blog-rules-preview" element={<LegalTextView />} />
              <Route path="reset-password" element={<ResetPasswordPage />} />
              <Route path="faq" element={<FaqView />} />
            </Route>
            <Route
              path="/blog"
              element={<PrivateLayout><ProtectedRoute element={<BlogView />} /></PrivateLayout>}
            />
            <Route
              path="/admin"
              element={<PrivateLayout><ProtectedRoute element={<AdminView />} /></PrivateLayout>}
            />
            <Route
              path="/admin/posts"
              element={<PrivateLayout><ProtectedRoute element={<AdminPostView userId={session.userId || 0} />} /></PrivateLayout>}
            />
            <Route
              path="/admin/events"
              element={<PrivateLayout><ProtectedRoute element={<AdminEventView userId={session.userId || 0} />} /></PrivateLayout>}
            />
            <Route
              path="/admin/legal/:type"
              element={<PrivateLayout><ProtectedRoute element={<AdminLegalTextView />} /></PrivateLayout>}
            />
            <Route
              path="/admin/users"
              element={<PrivateLayout><ProtectedRoute element={<AdminUsersView />} /></PrivateLayout>}
            />
            <Route
              path="/admin/texts"
              element={<PrivateLayout><ProtectedRoute element={<AdminTextView userId={session.userId || 0} />} /></PrivateLayout>}
            />
            <Route
              path="/profile"
              element={<PrivateLayout><ProtectedRoute element={<ProfileView posts={[]} />} /></PrivateLayout>}
            />
            <Route path="/logout" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>

        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </SWRConfig>
    </ErrorBoundary>
  );

};

export default App;


