import React from "react";

const TestDashboard = () => {
  console.log("TestDashboard component rendered successfully");

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#1f2937",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        🎉 Dashboard Working!
      </h1>

      <div
        style={{
          backgroundColor: "#374151",
          padding: "1rem",
          borderRadius: "8px",
          marginBottom: "1rem",
        }}
      >
        <h2>Authentication Status:</h2>
        <p>✅ Login successful</p>
        <p>✅ Session-based auth working</p>
        <p>✅ Protected route accessible</p>
        <p>✅ Dashboard component rendering</p>
      </div>

      <div
        style={{
          backgroundColor: "#059669",
          padding: "1rem",
          borderRadius: "8px",
        }}
      >
        <p>
          <strong>Success!</strong> The authentication and routing system is
          working correctly.
        </p>
        <p>If you see this, the blank screen issue is resolved.</p>
      </div>
    </div>
  );
};

export default TestDashboard;
