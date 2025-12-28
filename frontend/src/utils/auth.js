import axios from "axios";

export async function validateToken(token) {
  try {
    await axios.get("http://localhost:5000/api/auth/validate", {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    return true;
  } catch {
    return false;
  }
}
