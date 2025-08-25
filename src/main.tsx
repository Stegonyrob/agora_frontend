import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import '../src/core/auth/TokenRefresher';
// 🛡️ Configurar interceptores CSRF
import App from './App.jsx';

import { log } from './core/logging/LoggerService';
import './index.scss';
import store from './redux/store.js';

// 🛡️ Inicializar protección CSRF


const rootElement = document.getElementById('root');
if (!rootElement) {
    const error = new Error("Could not find the 'root' element");
    log.critical('Error crítico en inicialización', error, {
        component: 'Main'
    });
    throw error;
}

const root = ReactDOM.createRoot(rootElement);

// 🚀 Renderizar aplicación con manejo de errores
try {
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
} catch (error) {
    log.critical('Error crítico durante el renderizado de React', error, {
        component: 'Main'
    });
    throw error;
}
