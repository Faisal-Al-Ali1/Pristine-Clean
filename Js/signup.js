import {
    app,
    auth,
    db,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    ref,
    set,
    get
  } from "./firebase-config.js";
  
  // Password Toggle
  const togglePassword = document.getElementById("togglePassword");
  const passwordField = document.getElementById("password");
  
  const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");
  const confirmPasswordField = document.getElementById("confirmPassword");
  
  togglePassword.addEventListener("click", () => {
    const type =
      passwordField.getAttribute("type") === "password" ? "text" : "password";
    passwordField.setAttribute("type", type);
    // Toggle icon between "eye" and "eye-off"
    togglePassword
      .querySelector("svg")
      .setAttribute("fill", type === "password" ? "currentColor" : "#007bff");
  });
  
  toggleConfirmPassword.addEventListener("click", () => {
    const type =
      confirmPasswordField.getAttribute("type") === "password"
        ? "text"
        : "password";
    confirmPasswordField.setAttribute("type", type);
    // Toggle icon between "eye" and "eye-off"
    toggleConfirmPassword
      .querySelector("svg")
      .setAttribute("fill", type === "password" ? "currentColor" : "#007bff");
  });
  
  // Form data fetch and validation
  const signUpForm = document.getElementById("sign-up-form");
  const registrationMessage = document.getElementById("signUpMessage");
  
  signUpForm.addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const formData = new FormData(signUpForm);
    const username = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    const termsCheckbox = document.getElementById("terms");
  
    // Regex patterns for email and password validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
  
    if (!username || !email || !password || !confirmPassword) {
      registrationMessage.textContent = "Please fill in all fields.";
      return;
    }
  
    if (!emailPattern.test(email)) {
      registrationMessage.textContent = "Invalid email format.";
      return;
    }
  
    if (!passwordPattern.test(password)) {
      registrationMessage.textContent =
        "Password must be at least 8 characters long and contain at least one numeric digit, one uppercase letter, one lowercase letter, and one special character.";
      return;
    }
  
    if (password !== confirmPassword) {
      registrationMessage.textContent = "Passwords do not match.";
      return;
    }
  
    if (!termsCheckbox.checked) {
      registrationMessage.textContent = "You must agree to the Terms of Service and Privacy Policy.";
      return;
    }
  
    try {
      // Create a new user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
  
      // Create a userData object including uid
      const userData = {
        uid: user.uid, // Add uid
        username,
        email,
      };
  
      // Store user data in Realtime Database
      await set(ref(db, `users/${user.uid}`), userData);
  
      // Store user data in localStorage
      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("isNewUser", "true"); // Mark the user as new
  
      registrationMessage.textContent = "Registration successful!";
      setTimeout(() => {
        window.location.href = "./index.html";
      }, 300);
    } catch (error) {
      registrationMessage.textContent = `${error.message}`;
    }
  });
  
  // Google Sign-Up Button
  const googleSignUpButton = document.querySelector("button[type='button']"); // Assuming the Google button is the first button in the form
  
  googleSignUpButton.addEventListener("click", async () => {
    try {
      // Initialize Google Auth Provider
      const provider = new GoogleAuthProvider();
  
      // Sign in with Google using Firebase Authentication
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
  
      // Create a userData object including uid
      const userData = {
        uid: user.uid, // Add uid
        username: user.displayName || "Google User", // Use displayName from Google, or fallback to "Google User"
        email: user.email,
        photoURL: user.photoURL, // Optional: Store the user's profile picture URL
      };
  
      // Store user data in Realtime Database
      await set(ref(db, `users/${user.uid}`), userData);
  
      // Store user data in localStorage
      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("isNewUser", "true"); // Mark the user as new
  
      // Redirect to the homepage or dashboard
      window.location.href = "./index.html";
    } catch (error) {
      console.error("Google Sign-Up Error:", error);
      registrationMessage.textContent = `Error during Google sign-up: ${error.message}`;
    }
  });