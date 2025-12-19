import React from "react";
import { useSelector } from "react-redux";

const AppDebugger = () => {
  const authState = useSelector((state) => state.auth);

  React.useEffect(() => {
    console.log("🔍 App Debug - Auth State:", authState);
    console.log("🔍 App Debug - Current URL:", window.location.href);
  }, [authState]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "10px",
        left: "10px",
        background: "rgba(0,0,0,0.8)",
        color: "white",
        padding: "10px",
        borderRadius: "5px",
        fontSize: "12px",
        maxWidth: "300px",
        zIndex: 10000,
      }}
    >
      <div>
        <strong>Debug Info:</strong>
      </div>
      <div>URL: {window.location.pathname}</div>
      <div>Authenticated: {String(authState.isAuthenticated)}</div>
      <div>User: {authState.user?.email || "null"}</div>
      <div>Loading: {String(authState.isLoading)}</div>
      <div>SessionVerified: {String(authState.sessionVerified)}</div>
    </div>
  );
};

export default AppDebugger;
