import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import '../src/core/auth/TokenRefresher';
// 🛡️ Configurar interceptores CSRF

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';

import { log } from './core/logging/LoggerService';
import './index.scss';
import store from './redux/store';




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
    const queryClient = new QueryClient();
    root.render(
        // TEMPORARY: StrictMode disabled to fix double post creation
        // <React.StrictMode>
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                    <App />
                </BrowserRouter>
            </QueryClientProvider>
        </Provider>
        // </React.StrictMode>
    );
} catch (error) {
    log.critical('Error crítico durante el renderizado de React', error, {
        component: 'Main'
    });
    throw error;
}
