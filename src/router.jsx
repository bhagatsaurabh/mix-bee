import { createRef } from "react";
import { createBrowserRouter } from "react-router-dom";

import Error from "./containers/Error/Error";
import Home from "./containers/Home/Home";
import Hive from "./containers/Hive/Hive";
import Recordings from "./containers/Recordings/Recordings";

export const routes = [
  {
    path: "/",
    element: <Home />,
    errorElement: <Error />,
  },
  {
    path: "/hive",
    element: <Hive />,
    errorElement: <Error />,
    children: [
      {
        path: "/hive/recordings",
        element: <Recordings />,
        errorElement: <Error />,
        nodeRef: createRef(),
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
