import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import LoginForm from "./components/LoginForm";
import AdminPollCreate from "./components/AdminPollCreate";
import PollList from "./components/PollList";
import PollView from "./components/PollView";
import PollResults from "./components/PollResults";

function PrivateRoute({ children, adminOnly = false }) {
  const { user, token } = useAuth();

  if (!token) return <Navigate to="/login" />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/" />;

  return children;
}

export default function App() {
  return (
    <div className="h-full w-full">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route
            path="/admin/polls/new"
            element={
              <PrivateRoute adminOnly>
                <AdminPollCreate />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/polls/:id/results"
            element={
              <PrivateRoute adminOnly>
                <PollResults />
              </PrivateRoute>
            }
          />
          <Route
            path="/polls/:id"
            element={
              // <PrivateRoute>
              <PollView />
              // </PrivateRoute>
            }
          />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <PollList />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
