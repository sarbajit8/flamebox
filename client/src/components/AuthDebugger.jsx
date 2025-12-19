import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { verifySession } from "../store/auth/auth-slice";

const AuthDebugger = () => {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("🔍 Current Auth State:", authState);
  }, [authState]);

  const handleTestVerify = () => {
    console.log("🧪 Testing session verification...");
    dispatch(verifySession());
  };

  const handleTestLogin = async () => {
    console.log("🧪 Testing direct login...");

    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/users/login",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            emailOrPhone: "admin@flamebox.com",
            password: "admin123",
            role: "admin",
          }),
        }
      );

      const data = await response.json();
      console.log("Login response:", data);

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.reload(); // Reload to update auth state
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleCheckCookies = () => {
    console.log("🍪 Document cookies:", document.cookie);
    console.log("🗂️ LocalStorage user:", localStorage.getItem("user"));
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        background: "white",
        padding: "15px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        zIndex: 9999,
        fontSize: "12px",
        maxWidth: "300px",
      }}
    >
      <h3>Auth Debugger</h3>

      <div style={{ marginBottom: "10px" }}>
        <strong>State:</strong>
        <br />
        isAuthenticated: {String(authState.isAuthenticated)}
        <br />
        sessionVerified: {String(authState.sessionVerified)}
        <br />
        user: {authState.user ? authState.user.email : "null"}
        <br />
        error: {authState.error || "none"}
      </div>

      <button
        onClick={handleTestVerify}
        style={{ marginRight: "5px", marginBottom: "5px" }}
      >
        Test Verify Session
      </button>
      <button
        onClick={handleTestLogin}
        style={{ marginRight: "5px", marginBottom: "5px" }}
      >
        Quick Login
      </button>
      <button onClick={handleCheckCookies} style={{ marginBottom: "5px" }}>
        Check Cookies
      </button>
    </div>
  );
};

export default AuthDebugger;
