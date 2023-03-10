import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider as ReduxProvider } from 'react-redux';
// material
// import AdapterDateFns from '@mui/lab/AdapterDateFns';
// import LocalizationProvider from '@mui/lab/LocalizationProvider';
// contexts
import { SettingsProvider } from './contexts/SettingsContext';
import { CollapseDrawerProvider } from './contexts/CollapseDrawerContext';
// components
import App from './App';
import * as serviceWorker from './serviceWorker';
import reportWebVitals from './reportWebVitals';
import store from './store'

// ----------------------------------------------------------------------

ReactDOM.render(
  <HelmetProvider>
    <ReduxProvider store={store}>
      {/* <LocalizationProvider dateAdapter={AdapterDateFns}> */}
        <SettingsProvider>
          <CollapseDrawerProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </CollapseDrawerProvider>
        </SettingsProvider>
      {/* </LocalizationProvider> */}
    </ReduxProvider>
  </HelmetProvider>,
  document.getElementById('root')
);

// If you want to enable client cache, register instead.
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
