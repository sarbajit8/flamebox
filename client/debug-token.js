// Add this to your browser console after login to debug token issues

console.log("=== TOKEN DEBUG ===");
console.log("Token in localStorage:", localStorage.getItem("token"));
console.log("User in localStorage:", localStorage.getItem("user"));
console.log("SessionId in localStorage:", localStorage.getItem("sessionId"));

// Test if the token format is correct
const token = localStorage.getItem("token");
if (token) {
  console.log("Token starts with 'eyJ':", token.startsWith("eyJ"));
  console.log("Token length:", token.length);

  // Test making an authenticated request
  fetch("http://localhost:3000/api/auth/users/verify", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Auth test response:", data);
    })
    .catch((error) => {
      console.error("Auth test error:", error);
    });
} else {
  console.log("❌ No token found in localStorage");
}
