
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
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
import ProtectedRoute from './routes/ProtectedRoute';
const App = () => {
  return (

    <Router>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/*" element={<MainLayout />} />
        <Route path="/Logout" element={<HomeView />} />
      </Routes>
      <Footer />
    </Router>

  );
};

const MainLayout = () => {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/AboutMe" element={<AboutMeView />} />
        <Route path="/Neurodiversity" element={<NeurodiversityView />} />
        <Route path="/Services" element={<ServiceView />} />
        <Route path="/Blog" element={<ProtectedRoute element={<BlogView />} path={'/Blog'}>

        </ProtectedRoute>} />
        <Route path="/Agora" element={<AgoraView />} />
        <Route path="/Tea" element={<TeaView />} />
        <Route path="/Tda_Tdh" element={<Tda_TdhView />} />
        <Route path="/Aprendizaje" element={<TransAprendizajeView />} />
        <Route path="/Madurativo" element={<TransMadurativoView />} />
        <Route path="/Login" element={<LoginView />} />
        <Route path="/Register" element={<RegisterView />} />
        <Route path="/Logout" element={<HomeView />} />
      </Routes>
    </>
  );
};

export default App;