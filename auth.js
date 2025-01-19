if (!window.supabase) {
  console.error("Supabase client is not initialized. Please check your supabase.js configuration.");
  alert("Supabase client initialization failed.");
} else {
  const supabase = window.supabase;
  let currentUser = null;
  let userLocation = null;

  // Function to fetch current location
  const fetchUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve({ latitude, longitude });
          },
          (error) => {
            reject(`Error fetching location: ${error.message}`);
          }
        );
      } else {
        reject("Geolocation is not supported by this browser.");
      }
    });
  };

  // Sign-up form handler
  const signupForm = document.getElementById("signupModal");
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { user, session, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: { name: name },
      },
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Sign-up successful! Please check your email to confirm your account.");
    }
  });

  // Sign-in form handler
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Create a new user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (authError) {
      alert(authError.message);
      return;
    }

    // Insert user data into the 'users' table
    const { error: dbError } = await supabase.from("users").insert([
      {
        id: authData.user.id, // Use the user's unique ID from Supabase Auth
        name: name,
        email: email,
      },
    ]);

    if (dbError) {
      alert(`Database error: ${dbError.message}`);
    } else {
      alert("Sign-up successful! Please check your email to confirm your account.");
    }
  });

  // Sign-out button handler
  const signoutBtn = document.getElementById("sign-out");
  signoutBtn.addEventListener("click", async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(error.message);
    } else {
      clearSessionData();
      alert("Signed out successfully!");
      window.location.href = "https://zambane.netlify.app/";
    }
  });

  // Clear session data
  function clearSessionData() {
    currentUser = null;
    console.log("Session data cleared");
  }

  // Authentication state change listener
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT") {
      currentUser = null;
    } else if (event === "SIGNED_IN") {
      console.log("User session login", session.user);
      currentUser = session.user;
    }
    updateButtons();
  });

  // Button references
  const getStartedBtn = document.getElementById("getStartedBtn");
  const makeRequestBtn = document.getElementById("makeRequestBtn");

  function updateButtons() {
    if (currentUser) {
      getStartedBtn.style.display = "none";
      makeRequestBtn.style.display = "inline-block";

      // Fetch user's current location on login
      fetchUserLocation()
        .then((location) => {
          userLocation = location;
          console.log("User location fetched:", userLocation);
        })
        .catch((err) => console.error(err));
    } else {
      getStartedBtn.style.display = "inline-block";
      makeRequestBtn.style.display = "none";
    }
  }

  // Fetch session on initial load
  (async () => {
    const { data: session } = await supabase.auth.getSession();
    if (session) {
      currentUser = session.user;
      console.log("User is logged in:", currentUser);

      // Fetch user's current location
      fetchUserLocation()
        .then((location) => {
          userLocation = location;
          console.log("User location fetched:", userLocation);
        })
        .catch((err) => console.error(err));
    } else {
      currentUser = null;
      console.log("User is not logged in.");
    }
    updateButtons();
  })();

  // Handle Make Request button click
  if (makeRequestBtn) {
    makeRequestBtn.addEventListener("click", async () => {
      if (!userLocation) {
        alert("Unable to fetch your location. Please enable location services and try again.");
        return;
      }

      try {
        const { latitude, longitude } = userLocation;
        const { error } = await supabase.from("locations").insert([
          {
            user_id: currentUser.id,
            latitude: latitude,
            longitude: longitude,
          },
        ]);

        if (error) {
          console.error("Error saving location:", error.message);
          alert("Failed to save location. Please try again.");
        } else {
          console.log("Location saved successfully!");
          alert("Request made successfully!");
        }
      } catch (err) {
        console.error("Error:", err);
        alert("An unexpected error occurred.");
      }
    });
  }
}
