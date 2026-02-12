import { useState } from "react";
import { auth } from "../services/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const register = async () => {
  try {
    await createUserWithEmailAndPassword(auth, email, pass);
    alert("Register sukses!");
  } catch (err) {
    alert(err.message);
  }
};


  const login = async () => {
  try {
    await signInWithEmailAndPassword(auth, email, pass);
    alert("Login sukses!");
  } catch (err) {
    alert(err.message);
  }
};


  const logout = async () => {
    await signOut(auth);
    alert("Logout sukses!");
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>🔐 Login System</h2>

      <input
        placeholder="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="password"
        type="password"
        onChange={(e) => setPass(e.target.value)}
      />
      <br /><br />

      <button onClick={login}>Login</button>
      <button onClick={register}>Register</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
