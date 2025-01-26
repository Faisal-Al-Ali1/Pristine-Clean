import { auth, signOut } from "./firebase-config.js";

// Get references to the navbar elements
const authButtons = document.getElementById("authButtons");
const userProfile = document.getElementById("userProfile");
const profileIcon = document.getElementById("profileIcon");
const signOutButton = document.getElementById("signOutButton");

// Function to update the navbar based on the user's authentication state
const updateNavbar = (user) => {
  if (user) {
    // User is signed in
    authButtons.style.display = "none"; // Hide Sign In / Sign Up buttons
    userProfile.style.display = "flex"; // Show Profile Icon and Sign Out button

    // Update the profile icon with the user's photo (if available)
    if (user.photoURL) {
      profileIcon.src = user.photoURL;
    }
  } else {
    // User is signed out
    authButtons.style.display = "flex"; // Show Sign In / Sign Up buttons
    userProfile.style.display = "none"; // Hide Profile Icon and Sign Out button
  }
};

// Check if the user is signed in using localStorage
const userData = JSON.parse(localStorage.getItem("userData"));

if (userData) {
  // User is signed in
  updateNavbar(userData);
} else {
  // User is signed out
  updateNavbar(null);
}

// Firebase Authentication State Listener
auth.onAuthStateChanged((user) => {
  if (user) {
    // User is signed in
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
    localStorage.setItem("userData", JSON.stringify(userData));
    updateNavbar(userData);
  } else {
    // User is signed out
    localStorage.removeItem("userData");
    updateNavbar(null);
  }
});

// Sign-Out Functionality
signOutButton.addEventListener("click", async () => {
  try {
    await signOut(auth);
    localStorage.removeItem("userData");
    updateNavbar(null);
    console.log("User signed out successfully.");
    // Redirect to the homepage or login page
    window.location.href = "./index.html";
  } catch (error) {
    console.error("Sign-out error:", error);
  }
});