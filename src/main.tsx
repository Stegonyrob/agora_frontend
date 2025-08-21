import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import '../src/core/auth/TokenRefresher';
import App from './App.jsx';
import './index.scss';
import store from './redux/store.js';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find the 'root' element");
}

const root = ReactDOM.createRoot(rootElement);
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