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
import { IPost } from './core/posts/IPost';
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
          <Route path="/Logout" element={<Navigate to="/" replace />} />
          <Route path="/AboutMe" element={<PrivateLayout />}>
            <Route path="" element={<AboutMeView />} />
          </Route>
          <Route path="/Neurodiversity" element={<PrivateLayout />}>
            <Route path="" element={<NeurodiversityView />} />
          </Route>
          <Route path="/Services" element={<PrivateLayout />}>
            <Route path="" element={<ServiceView />} />
          </Route>
          <Route path="/Agora" element={<PrivateLayout />}>
            <Route path="" element={<AgoraView />} />
          </Route>
          <Route path="/Cea" element={<PrivateLayout />}>
            <Route path="" element={<TeaView />} />
          </Route>
          <Route path="/Tda_Tdh" element={<PrivateLayout />}>
            <Route path="" element={<Tda_TdhView />} />
          </Route>
          <Route path="/Aprendizaje" element={<PrivateLayout />}>
            <Route path="" element={<DificultadAprendizajeView />} />
          </Route>
          <Route path="/Desarrollo" element={<PrivateLayout />}>
            <Route path="" element={<CondicionesDesarrolloView />} />
          </Route>
          <Route path="/Login" element={<PrivateLayout />}>
            <Route path="" element={<LoginView />} />
          </Route>
          <Route path="/Register" element={<PrivateLayout />}>
            <Route path="" element={<RegisterView />} />
          </Route>
          <Route path="/Error404" element={<PrivateLayout />}>
            <Route path="" element={<Error404View />} />
          </Route>
          <Route path="/Blog" element={<PrivateLayout />}>
            <Route path="/Blog" element={<ProtectedRoute element={<BlogView />} />} /></Route>
          <Route path="/Admin" element={<PrivateLayout />}>
            <Route path="/Admin" element={<ProtectedRoute element={<AdminView />} />} /></Route>
          <Route path="/Profile" element={<PrivateLayout />}>
            <Route path="/Profile" element={<ProtectedRoute element={<ProfileView posts={[]} onDeletePost={function (postId: string): void {
              throw new Error('Function not implemented.');
            }} onEditPost={function (post: IPost): void {
              throw new Error('Function not implemented.');
            }} />} />} /></Route>
        </Routes>


      </Router>
      <Footer />
    </SWRConfig>
  );
};

export default App;