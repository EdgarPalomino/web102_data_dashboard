import { useRoutes } from "react-router";
import Composer from "./Composer";
import "./App.css";
import Display from "./Display";

const App = () => {

  const routes = useRoutes([
    {path: "/", element: <Display />},
    {path: "/composer/:name", element: <Composer />}
  ]);

  return routes;

};

export default App;
