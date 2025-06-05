import React, { useState } from "react";
import Input from "./Common/Input";
import { signUp } from "../API/Auth";
import IGLogo from "../assets/IGLogo.png";
import { useNavigate } from "react-router-dom";
import { createUser } from "../API/Firestore";
import Toast from "./Common/Toast";
import { updateProfile } from "firebase/auth";
import { database } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export default function SignUp() {
  let navigate = useNavigate();
  const [inputs, setInputs] = useState({});

  function handleInput(event) {
    const { name, value } = event.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handlesignUp() {
    try {
      const response = await signUp(inputs.email, inputs.password);
      const { name, username, email } = inputs; // Destructure name, username, and email
      const userId = response.user.uid; // Get the user ID
      const timestamp = new Date(); // Get the current timestamp
  
      await createUser(name, username, email); // Await the createUser function
      await updateProfile(response.user, { displayName: name });
      localStorage.setItem("app_username", name); // Use a namespaced key
      localStorage.setItem("app_userEmail", email); // Use a namespaced key
  
      // Add the user data to Firestore
      await setDoc(doc(database, "users", userId), {
        name,
        username,
        email,
        userId,
        timestamp,
      });
  
      Toast("Sign Up Successful!", "success");
      navigate("/");
    } catch (error) {
      console.error("Error signing up:", error);  
      Toast("Sign Up Failed", "error");
    }
  }

  return (
    <div className="login-container">
      <img className="Ig-logo" loading="lazy" src={IGLogo} alt="Instagram Logo" />
      <Input
        placeholder="Enter your Name"
        name="name"
        handleInput={handleInput}
        value={inputs.name}
        type="text"
      />

      <Input
        placeholder="Enter your Username"
        name="username"
        handleInput={handleInput}
        value={inputs.username}
        type="text"
      />

      <Input
        placeholder="Enter your Email"
        name="email"
        handleInput={handleInput}
        value={inputs.email}
        type="email"
      />

      <Input
        placeholder="Enter your Password"
        name="password"
        handleInput={handleInput}
        value={inputs.password}
        type="password"
      />

      <button className="login-btn" onClick={handlesignUp}>
        Sign Up
      </button>

      <p className="link" onClick={() => navigate("/")}>
        Sign In!
      </p>
    </div>
  );
}
