import { createBrowserRouter } from "react-router-dom";
import Error from "./containers/Error/Error";
import Home from "./containers/Home/Home";
import Hive from "./containers/Hive/Hive";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <Error />,
  },
  {
    path: "/hive",
    element: <Hive />,
    errorElement: <Error />,
  },
]);

export default router;
