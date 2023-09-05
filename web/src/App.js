import { Switch, Route } from 'react-router-dom';

import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Main from './components/layout/Main';
import 'antd/dist/antd.css';
import './assets/styles/main.css';
import './assets/styles/responsive.css';
import useAuth from './hooks/useAuth';
import Loader from './components/Loader';
import ROUTES from './routes';
import Home from './pages/Home';
import Storage from './pages/Storage';

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <div className='App'>
      <Switch>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {isAuthenticated ? (
              <Main>
                {ROUTES.map(
                  (
                    { exact, path, title, component: Component, name },
                    index
                  ) => {
                    return (
                      <Route
                        key={index}
                        exact={exact}
                        path={path}
                        render={(props) => (
                          <Component {...props} title={title} name={name} />
                        )}
                      />
                    );
                  }
                )}
                <Route path='/' exact component={Home} />
              </Main>
            ) : (
              <>
                <Route path='/sheets' exact component={Storage} />
                <Route path='/sign-up' exact component={SignUp} />
                <Route path='/sign-in' exact component={SignIn} />
                <Route path='/' exact={true} component={SignIn} />
              </>
            )}
          </>
        )}
      </Switch>
    </div>
  );
}

export default App;
