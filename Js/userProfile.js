// import { db, ref, set, get } from "./firebase-config";

// Get user data from localStorage
const userData = JSON.parse(localStorage.getItem("userData"));
const isNewUser = localStorage.getItem("isNewUser");

// DOM Elements
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const profilePicture = document.getElementById("profileImage"); // Profile picture container

// phoneNumber regex
const phoneNumberPattern = /^07\d{8}$/;

// Default profile picture URL
const defaultProfilePic = "../images/user.png";

// Check if user is signed in
if (userData) {
  const { displayName, email, photoURL } = userData;

  // Populate username if available
  nameInput.value = displayName || "";

  // Populate email if available
  emailInput.value = email || "";

  // Set profile picture
  if (photoURL) {
    // Use Google profile picture if user signs in with Google
    profilePicture.style.backgroundImage = `url(${photoURL})`;
  } else {
    // Default profile picture for normal sign-ins
    profilePicture.style.backgroundImage = `url(${defaultProfilePic})`;
  }
} else {
  // If no user data exists (not signed in), default profile picture
  profilePicture.style.backgroundImage = `url(${defaultProfilePic})`;
}
