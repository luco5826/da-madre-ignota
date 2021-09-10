import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LoginView from "./views/LoginView";
import MainNavbar from "./components/MainNavbar";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import { useEffect, useState } from "react";
import { AuthenticationContext } from "./Utils";
import API from "./API";
import { UserLoginInfo } from "./commonTypes";
import HomeView from "./views/HomeView";
import AvailabilityView from "./views/AvailabilityView";
import OrdersView from "./views/OrdersView";

function App() {
  const [loggedUser, setLoggedUser] = useState<UserLoginInfo>({
    isLogged: false,
    user: {},
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    API.isLogged().then((user) => {
      setLoggedUser(user);
      setIsLoading(false);
    });
  }, []);

  const handleLogout = () => setLoggedUser({ isLogged: false, user: {} });
  const handleLogin = (user: UserLoginInfo) => setLoggedUser(user);

  return isLoading ? (
    <></>
  ) : (
    <Router>
      <AuthenticationContext.Provider value={loggedUser}>
        <MainNavbar handleLogout={handleLogout} />
        <Switch>
          <Route
            exact
            path="/login"
            render={() => <LoginView handleLogin={handleLogin} />}
          />
          <Route
            exact
            path={["/", "/home"]}
            render={() => (
              <AuthenticatedRoute>
                <HomeView />
              </AuthenticatedRoute>
            )}
          />
          <Route
            exact
            path={"/avail"}
            render={() => (
              <AuthenticatedRoute>
                <AvailabilityView />
              </AuthenticatedRoute>
            )}
          />
          <Route
            exact
            path={"/orders"}
            render={() => (
              <AuthenticatedRoute>
                <OrdersView />
              </AuthenticatedRoute>
            )}
          />
        </Switch>
      </AuthenticationContext.Provider>
    </Router>
  );
}

export default App;
