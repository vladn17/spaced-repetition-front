import * as React from 'react';
import { useAuth } from '../../context/auth';
import Spinner from '../../components/Spinner';
import ErrorBoundary from '../../components/ErrorBoundary';
import { ThemeProvider } from '../../context/theme';
import { NotificationsProvider } from '../../context/notifications';

const loadAuthApp = () => import('./AuthApp');
const AuthApp = React.lazy(loadAuthApp);
const UnAuthApp = React.lazy(() => import('./UnAuthApp'));

const App: React.FC = () => {
  const { isAuth } = useAuth();
  React.useEffect(() => {
    loadAuthApp();
  }, []);
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NotificationsProvider>
          <React.Suspense fallback={<Spinner fullscreen />}>
            {isAuth ? <AuthApp /> : <UnAuthApp />}
          </React.Suspense>
        </NotificationsProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
