import {
    app,
    auth,
    db,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    ref,
    get,
    set,
  } from "./firebase-config.js";
  
  // Password Toggle for Login
  const togglePassword = document.getElementById("togglePassword");
  const passwordField = document.getElementById("password");
  
  togglePassword.addEventListener("click", () => {
    const type =
      passwordField.getAttribute("type") === "password" ? "text" : "password";
    passwordField.setAttribute("type", type);
    // Toggle icon between "eye" and "eye-off"
    togglePassword
      .querySelector("svg")
      .setAttribute("fill", type === "password" ? "currentColor" : "#007bff");
  });
  
  // Login Form Submission
  const loginForm = document.getElementById("login-form");
  const loginMessage = document.getElementById("loginMessage");
  
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const email = loginForm.email.value;
    const password = loginForm.password.value;
  
    // Regex pattern for email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!email || !password) {
      loginMessage.textContent = "Please fill in all fields.";
      return;
    }
  
    if (!emailPattern.test(email)) {
      loginMessage.textContent = "Invalid email format.";
      return;
    }
  
    try {
      // Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
  
      // Fetch user data from Realtime Database
      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);
  
      if (snapshot.exists()) {
        const userData = snapshot.val();
  
        // Store user data in localStorage
        localStorage.setItem("userData", JSON.stringify(userData));
        localStorage.setItem("isNewUser", "false"); // Mark the user as not new
  
        // Display success message
        loginMessage.textContent = "Login successful! Redirecting...";
        loginMessage.style.color = "green";
  
        // Redirect to the homepage or dashboard after 2 seconds
        setTimeout(() => {
          window.location.href = "./index.html";
        }, 2000);
      } else {
        loginMessage.textContent = "User data not found.";
        loginMessage.style.color = "red";
      }
    } catch (error) {
      console.error("Login Error:", error);
      loginMessage.textContent = `Error during login: ${error.message}`;
      loginMessage.style.color = "red";
    }
  });
  
  // Google Login Button
  const googleLoginButton = document.querySelector("button[type='button']"); // Assuming the Google button is the first button in the form
  
  googleLoginButton.addEventListener("click", async () => {
    try {
      // Initialize Google Auth Provider
      const provider = new GoogleAuthProvider();
  
      // Sign in with Google using Firebase Authentication
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
  
      // Fetch user data from Realtime Database
      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);
  
      if (snapshot.exists()) {
        const userData = snapshot.val();
  
        // Store user data in localStorage
        localStorage.setItem("userData", JSON.stringify(userData));
        localStorage.setItem("isNewUser", "false"); // Mark the user as not new
  
        // Display success message
        loginMessage.textContent = "Google login successful! Redirecting...";
        loginMessage.style.color = "green";
  
        // Redirect to the homepage or dashboard after 2 seconds
        setTimeout(() => {
          window.location.href = "./index.html";
        }, 2000);
      } else {
        // If user data doesn't exist, create it
        const userData = {
          uid: user.uid,
          username: user.displayName || "Google User",
          email: user.email,
          photoURL: user.photoURL,
        };
  
        // Store user data in Realtime Database
        await set(ref(db, `users/${user.uid}`), userData);
  
        // Store user data in localStorage
        localStorage.setItem("userData", JSON.stringify(userData));
        localStorage.setItem("isNewUser", "false"); // Mark the user as not new
  
        // Display success message
        loginMessage.textContent = "Google login successful! Redirecting...";
        loginMessage.style.color = "green";
  
        // Redirect to the homepage or dashboard after 2 seconds
        setTimeout(() => {
          window.location.href = "./index.html";
        }, 2000);
      }
    } catch (error) {
      console.error("Google Login Error:", error);
      loginMessage.textContent = `Error during Google login: ${error.message}`;
      loginMessage.style.color = "red";
    }
  });