import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./routes/Dashboard";
import SignIn from "./routes/SignIn";
import SignUp from "./routes/SignUp";
import AuthContext from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Layout from "./routes/Layout";
import Debates from "./routes/Debates";
import ImportDebates from "./routes/ImportDebates";
import AddDebate from "./routes/AddDebate";
import ModifyDebate from "./routes/ModifyDebate";
import Help from "./routes/Help";
import { ThemeProvider } from "@/components/theme-provider";
import AddTournaments from "./routes/AddTournaments";
import Tournaments from "./routes/Tournaments";
import UnprotectedRoute from "./routes/UnprotectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "signin",
        element: (
          <UnprotectedRoute>
            <SignIn />
          </UnprotectedRoute>
        ),
      },
      {
        path: "signup",
        element: (
          <UnprotectedRoute>
            <SignUp />
          </UnprotectedRoute>
        ),
      },
      {
        path: "debates",
        element: (
          <ProtectedRoute>
            <Debates />
          </ProtectedRoute>
        ),
      },
      {
        path: "import",
        element: (
          <ProtectedRoute>
            <ImportDebates />
          </ProtectedRoute>
        ),
      },
      {
        path: "add",
        element: (
          <ProtectedRoute>
            <AddDebate />
          </ProtectedRoute>
        ),
      },
      {
        path: "add-tournaments",
        element: (
          <ProtectedRoute>
            <AddTournaments />
          </ProtectedRoute>
        ),
      },
      {
        path: "tournaments",
        element: (
          <ProtectedRoute>
            <Tournaments />
          </ProtectedRoute>
        ),
      },
      {
        path: "help",
        element: (
          <ProtectedRoute>
            <Help />
          </ProtectedRoute>
        ),
      },
      {
        path: "debates/:id",
        element: (
          <ProtectedRoute>
            <ModifyDebate />
          </ProtectedRoute>
        ),
      }
    ],
  },
]);

function App() {
  return (
    <ThemeProvider>
      <AuthContext>
        <RouterProvider router={router} />
      </AuthContext>
    </ThemeProvider>
  );
}

export default App;
