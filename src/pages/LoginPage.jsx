import { useState, useContext } from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import "../css/AuthForm.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/user");
    } catch (err) {
      setError("Login failed: " + err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/user");
    } catch (err) {
      setError("Google login failed: " + err.message);
    }
  };

  return (
    <div className="auth-form">
      <h2>Login to MovieApp</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>

     
      <div style={{ height: "10px" }}></div>

     
      <button onClick={handleGoogleLogin} className="google-login-button">
        <img
          src="https://i.pinimg.com/736x/b3/34/da/b334da9a6de1935453f9992e87d1f5b6.jpg"
          alt="Google Logo"
          className="google-icon"
        />
        Login with Google
      </button>

      {error && <p className="error">{error}</p>}

      <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
    </div>
  );
};

export default LoginPage;
