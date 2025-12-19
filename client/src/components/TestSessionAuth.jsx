// Test the session-based authentication with a complete frontend test
import React from "react";

function TestSessionAuth() {
  const handleLogin = async () => {
    try {
      console.log("🔐 Testing session-based login...");

      const response = await fetch(
        "http://localhost:3000/api/auth/users/login",
        {
          method: "POST",
          credentials: "include", // Important: Include cookies
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
      console.log("✅ Login Response:", data);

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log("🍪 Session cookie should be set automatically");

        // Test protected route immediately after login
        testProtectedRoute();
      }
    } catch (error) {
      console.error("❌ Login failed:", error);
    }
  };

  const testProtectedRoute = async () => {
    try {
      console.log("🔒 Testing protected route with session cookie...");

      const response = await fetch(
        "http://localhost:3000/api/auth/users/verify",
        {
          method: "GET",
          credentials: "include", // Include session cookies
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log("✅ Protected Route Response:", data);
    } catch (error) {
      console.error("❌ Protected route failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      console.log("🚪 Testing session-based logout...");

      const response = await fetch(
        "http://localhost:3000/api/auth/users/logout",
        {
          method: "POST",
          credentials: "include", // Include cookies for logout
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log("✅ Logout Response:", data);

      if (data.success) {
        localStorage.removeItem("user");
        console.log("🍪 Session cookie should be cleared by server");
      }
    } catch (error) {
      console.error("❌ Logout failed:", error);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>🧪 Session-Based Authentication Test</h2>
      <p>Open browser console to see test results</p>

      <div style={{ marginBottom: "10px" }}>
        <button
          onClick={handleLogin}
          style={{ marginRight: "10px", padding: "10px" }}
        >
          🔐 Test Login (Session)
        </button>

        <button
          onClick={testProtectedRoute}
          style={{ marginRight: "10px", padding: "10px" }}
        >
          🔒 Test Protected Route
        </button>

        <button onClick={handleLogout} style={{ padding: "10px" }}>
          🚪 Test Logout (Clear Session)
        </button>
      </div>

      <div
        style={{ background: "#f5f5f5", padding: "15px", marginTop: "20px" }}
      >
        <h3>📋 Test Instructions:</h3>
        <ol>
          <li>Click "Test Login" - should set session cookie automatically</li>
          <li>
            Click "Test Protected Route" - should work with session cookie (no
            Authorization header needed)
          </li>
          <li>Click "Test Logout" - should clear session cookie</li>
          <li>Try "Test Protected Route" again - should fail after logout</li>
        </ol>

        <h3>✅ Expected Behavior:</h3>
        <ul>
          <li>No Authorization headers needed in requests</li>
          <li>Cookies automatically included with credentials: 'include'</li>
          <li>Session persists across browser tabs/refresh until logout</li>
          <li>
            Server automatically manages session cookies (httpOnly, secure,
            sameSite)
          </li>
        </ul>
      </div>
    </div>
  );
}

export default TestSessionAuth;
