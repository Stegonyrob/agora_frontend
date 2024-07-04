import { Navigate, Outlet, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.scss';
import Footer from './assets/Components/Footer/Footer';
import NavBar from './assets/Components/NavBar/NavBar';
import './assets/scss/reset.scss';
import AboutMeView from './assets/Views/AboutMeView';
import AgoraView from './assets/Views/AgoraView';
import BlogView from './assets/Views/BlogView';
import HomeView from './assets/Views/HomeView';
import LoginView from './assets/Views/LoginView';
import NeurodiversityView from './assets/Views/NeurodiversityView';
import RegisterView from './assets/Views/RegisterView';
import ServiceView from './assets/Views/ServiceView';
import Tda_TdhView from './assets/Views/Tda_TdhView';
import TeaView from './assets/Views/TeaView';
import TransAprendizajeView from './assets/Views/TransAprendizajeView';
import TransMadurativoView from './assets/Views/TransMadurativoView';

const MainLayout = () => {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/*" element={<MainLayout />} />
        <Route path="/Logout" element={<Navigate to="/" replace />} /><Route path="/AboutMe" element={<MainLayout />}>
          <Route path="" element={<AboutMeView />} />
        </Route>
        <Route path="/Neurodiversity" element={<MainLayout />}>
          <Route path="" element={<NeurodiversityView />} />
        </Route>
        <Route path="/Services" element={<MainLayout />}>
          <Route path="" element={<ServiceView />} />
        </Route>
        <Route path="/Agora" element={<MainLayout />}>
          <Route path="" element={<AgoraView />} />
        </Route>
        <Route path="/Tea" element={<MainLayout />}>
          <Route path="" element={<TeaView />} />
        </Route>
        <Route path="/Tda_Tdh" element={<MainLayout />}>
          <Route path="" element={<Tda_TdhView />} />
        </Route>
        <Route path="/Aprendizaje" element={<MainLayout />}>
          <Route path="" element={<TransAprendizajeView />} />
        </Route>
        <Route path="/Madurativo" element={<MainLayout />}>
          <Route path="" element={<TransMadurativoView />} />
        </Route>
        <Route path="/Login" element={<MainLayout />}>
          <Route path="" element={<LoginView />} />
        </Route>
        <Route path="/Register" element={<MainLayout />}>
          <Route path="" element={<RegisterView />} />
        </Route>
        <Route path="/Blog" element={<MainLayout />}>

          <Route path="" element={<BlogView />} />
        </Route>



        {/* <Route path="/Blog" element={<ProtectedRoute element={<BlogView />} path={''} />} /> */}
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;