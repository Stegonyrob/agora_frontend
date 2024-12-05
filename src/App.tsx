import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { SWRConfig } from 'swr';
import './App.scss';
import Footer from './assets/Components/Footer/Footer';
import './assets/scss/reset.scss';
import Error404View from './assets/Views/404View';
import AboutMeView from './assets/Views/AboutMeView';
import AdminView from './assets/Views/AdminView';
import AgoraView from './assets/Views/AgoraView';
import BlogView from './assets/Views/BlogView';
import CondicionesDesarrolloView from './assets/Views/CondDesarrolloView';
import DificultadAprendizajeView from './assets/Views/DifAprendizajeView';
import HomeView from './assets/Views/HomeView';
import LoginView from './assets/Views/LoginView';
import NeurodiversityView from './assets/Views/NeurodiversityView';
import ProfileView from './assets/Views/ProfileView';
import RegisterView from './assets/Views/RegisterView';
import ServiceView from './assets/Views/ServiceView';
import Tda_TdhView from './assets/Views/Tda_TdhView';
import TeaView from './assets/Views/TeaView';
import PrivateLayout from './routes/PrivateLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicLayout from './routes/PublicLayout';
import swrConfig from './swrConfig';


const App = () => {
  return (
    <SWRConfig value={swrConfig}>
      <Router>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/*" element={<PublicLayout />} />
          <Route path="/logout" element={<Navigate to="/" replace />} />
          <Route path="/aboutMe" element={<PrivateLayout />}>
            <Route path="" element={<AboutMeView />} />
          </Route>
          <Route path="/neurodiversity" element={<PrivateLayout />}>
            <Route path="" element={<NeurodiversityView />} />
          </Route>
          <Route path="/services" element={<PrivateLayout />}>
            <Route path="" element={<ServiceView />} />
          </Route>
          <Route path="/agora" element={<PrivateLayout />}>
            <Route path="" element={<AgoraView />} />
          </Route>
          <Route path="/cea" element={<PrivateLayout />}>
            <Route path="" element={<TeaView />} />
          </Route>
          <Route path="/tda_Tdh" element={<PrivateLayout />}>
            <Route path="" element={<Tda_TdhView />} />
          </Route>
          <Route path="/aprendizaje" element={<PrivateLayout />}>
            <Route path="" element={<DificultadAprendizajeView />} />
          </Route>
          <Route path="/desarrollo" element={<PrivateLayout />}>
            <Route path="" element={<CondicionesDesarrolloView />} />
          </Route>
          <Route path="/login" element={<PrivateLayout />}>
            <Route path="" element={<LoginView />} />
          </Route>
          <Route path="/register" element={<PrivateLayout />}>
            <Route path="" element={<RegisterView />} />
          </Route>
          <Route path="/error404" element={<PrivateLayout />}>
            <Route path="" element={<Error404View />} />
          </Route>
          <Route path="/blog" element={<PrivateLayout />}>
            <Route path="/blog" element={<ProtectedRoute element={<BlogView />} />} /></Route>
          <Route path="/admin" element={<PrivateLayout />}>
            <Route path="/admin" element={<ProtectedRoute element={<AdminView />} />} /></Route>
          <Route path="/profile" element={<PrivateLayout />}>
            <Route path="/profile/:userId" element={<ProtectedRoute element={<ProfileView posts={[]} />} />}
            /></Route>
        </Routes>


      </Router>
      <Footer />
    </SWRConfig>
  );
};

export default App;