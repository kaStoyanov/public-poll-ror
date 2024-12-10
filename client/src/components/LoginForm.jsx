import { useState } from "react";
import client from "../api/client";
import useAuth from "../hooks/useAuth";
import Snackbar from "./Snackbar";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = useAuth((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await client.post("/login", { email, password });
      login(data.token, data.user);
      navigate("/");
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.error || "An error occurred during login");
    }finally {
      setLoading(false)
    }
  };

  return (
    <div className="min-h-screen  mx-4 flex items-center justify-center bg-gray-250">
      <form
        onSubmit={handleSubmit}
        className=" mx-4 bg-gray-400 p-8 rounded-lg shadow-md w-96"
      >
        <h2 className="text-3xl font-bold mb-6">Login</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email..."
              className="mt-1 px-2 py-1 block w-full text-black rounded-md bg-gray-100 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password..."
              className="mt-1 px-2 py-1 block w-full text-black rounded-md bg-gray-100 shadow-sm"
            />
          </div>
          <button
            disabled={loading}
            type="submit"
            className="w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700"
          >
            {loading ? (
              <>
                <ClipLoader size={20} color="white" className="mr-2" />
              </>
            ) : (
              "Login"
            )}
          </button>
        </div>
        {error && (
          <Snackbar
            message={error}
            isError={true}
            onClose={() => setError("")}
          />
        )}
      </form>
    </div>
  );
}
