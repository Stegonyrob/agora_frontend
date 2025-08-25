import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import '../src/core/auth/TokenRefresher';
// 🛡️ Configurar interceptores CSRF
import App from './App.jsx';
import { setupCSRFInterceptors } from './core/auth/CSRFInterceptor';
// 📝 Configurar sistema de logging
import { setupConsoleInterceptors } from './core/logging/ConsoleInterceptor';
import { logger } from './core/logging/LoggerService';
import './index.scss';
import store from './redux/store.js';

// � Inicializar sistema de logging ANTES que cualquier otra cosa
setupConsoleInterceptors();
logger.info('Sistema de logging inicializado', {
  environment: import.meta.env.NODE_ENV,
  timestamp: new Date().toISOString()
}, {
  component: 'Main'
});

// �🛡️ Inicializar protección CSRF
setupCSRFInterceptors();
logger.info('Protección CSRF inicializada globalmente', undefined, {
  component: 'Main'
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  const error = new Error("Could not find the 'root' element");
  logger.critical('Error crítico en inicialización', error, {
    component: 'Main'
  });
  throw error;
}

const root = ReactDOM.createRoot(rootElement);

// 🚀 Renderizar aplicación con manejo de errores
try {
  logger.info('Iniciando renderizado de la aplicación React', undefined, {
    component: 'Main'
  });

  root.render(
    // TEMPORARY: StrictMode disabled to fix double post creation
    // <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
    // </React.StrictMode>
  );

  logger.info('Aplicación React renderizada exitosamente', undefined, {
    component: 'Main'
  });
} catch (error) {
  logger.critical('Error crítico durante el renderizado de React', error, {
    component: 'Main'
  });
  throw error;
}