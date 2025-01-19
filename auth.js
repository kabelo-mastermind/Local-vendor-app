if (!window.supabase) {
  console.error("Supabase client is not initialized. Please check your supabase.js configuration.");
  alert("Supabase client initialization failed.");
} else {
  const supabase = window.supabase;
  let currentUser = null;

  // Utility function to insert or update user data in the 'clients' table
  const saveUserData = async (user) => {
    try {
      const { id, user_metadata, email } = user;

      const userData = {
        id,
        name: user_metadata?.name || "Anonymous",
        email,
      };

      console.log("Saving user data:", userData);

      const { data, error } = await supabase.from("clients").upsert([userData]);

      if (error) {
        console.error("Upsert failed:", error.message);
        return false;
      } else {
        console.log("User saved in 'clients':", data);
        return true;
      }
    } catch (err) {
      console.error("Error in saveUserData:", err.message);
      return false;
    }
  };

  // Listen for authentication state changes
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === "SIGNED_IN" && session?.user) {
      currentUser = session.user;
      console.log("User signed in:", currentUser);

      // Save the user in the 'clients' table after email confirmation
      const success = await saveUserData(currentUser);
      if (success) {
        console.log("User data saved successfully after email confirmation.");
      } else {
        console.error("Failed to save user data after email confirmation.");
      }
      updateButtons();
    } else if (event === "SIGNED_OUT") {
      console.log("User signed out.");
      currentUser = null;
      updateButtons();
    }
  });

  // Sign-up form handler
  const signupForm = document.getElementById("signupModal");
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const { user, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });

      if (error) throw new Error(error.message);

      alert("Sign-up successful! Please check your email to confirm your account.");
    } catch (err) {
      console.error("Sign-up error:", err.message);
      alert(err.message);
    }
  });

  // Sign-in form handler
  const signinForm = document.getElementById("signinModal");
  signinForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("signinEmail").value;
    const password = document.getElementById("signinPassword").value;

    try {
      const { user, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) throw new Error(error.message);

      alert("Sign-in successful!");
    } catch (err) {
      console.error("Sign-in error:", err.message);
      alert(err.message);
    }
  });

  // Sign-out handler
  const signoutBtn = document.getElementById("sign-out");
  signoutBtn.addEventListener("click", async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);

      currentUser = null;
      console.log("User signed out successfully.");
      alert("Signed out successfully!");
      window.location.href = "https://zambane.netlify.app/";
    } catch (err) {
      console.error("Sign-out error:", err.message);
      alert(err.message);
    }
  });

  // Update UI buttons based on authentication state
  function updateButtons() {
    const getStartedBtn = document.getElementById("getStartedBtn");
    const makeRequestBtn = document.getElementById("makeRequestBtn");

    if (!getStartedBtn || !makeRequestBtn) {
      console.error("Buttons not found in the DOM. Ensure the button IDs are correct.");
      return;
    }

    if (currentUser) {
      getStartedBtn.style.display = "none";
      makeRequestBtn.style.display = "inline-block";
    } else {
      getStartedBtn.style.display = "inline-block";
      makeRequestBtn.style.display = "none";
    }
  }

  // Fetch current session on page load
  (async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw new Error(error.message);

      if (session) {
        currentUser = session.user;
        console.log("User is logged in:", currentUser);
      } else {
        currentUser = null;
        console.log("User is not logged in.");
      }

      updateButtons();
    } catch (err) {
      console.error("Error fetching session:", err.message);
    }
  })();

  // get current user location and store it under current_locations table
  // Event listener for "Make Request" button
const makeRequestBtn = document.getElementById("makeRequestBtn");
makeRequestBtn.addEventListener("click", async () => {
  if (!currentUser) {
    alert("You need to be logged in to make a request.");
    return;
  }

  // Check if geolocation is available
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        console.log("Current Location:", latitude, longitude);

        try {
          // Save the location data to the 'current_locations' table
          const { data, error } = await supabase.from("current_locations").upsert([
            {
              user_id: currentUser.id,  // The logged-in user's ID
              latitude,
              longitude,
            },
          ]);

          if (error) {
            console.error("Error saving location:", error.message);
            alert("Failed to save your location. Please try again.");
          } else {
            console.log("Location saved:", data);
            alert("Your location has been saved successfully.");
          }
        } catch (err) {
          console.error("Error in saving location:", err.message);
          alert("An error occurred while saving your location.");
        }
      },
      (error) => {
        console.error("Error getting geolocation:", error.message);
        alert("Failed to get your location. Please enable location services.");
      }
    );
  } else {
    alert("Geolocation is not available on your device.");
  }
});

  // Map initialization
  const map = L.map("map").setView([-25.5416, 28.0992], 13); // Centered in Soshanguve
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
  }).addTo(map);

  // Fetch customer markers
  async function fetchMarkers() {
    try {
      const { data: customers, error } = await supabase
        .from("current_locations")
        .select("latitude, longitude");

      if (error) throw new Error(error.message);

      if (!customers || customers.length === 0) {
        console.log("No customer locations found.");
        return;
      }

      customers.forEach((customer) => {
        L.marker([customer.latitude, customer.longitude], {
          icon: L.icon({
            iconUrl: "./assets/markers/customer.jpg",
            iconSize: [30, 38],
            iconAnchor: [15, 50],
            popupAnchor: [0, -50],
          }),
        })
          .addTo(map)
          .bindPopup("<b>Customer</b>");
      });
    } catch (err) {
      console.error("Error fetching markers:", err.message);
      alert("Failed to load map markers. Please try again later.");
    }
  }

  // Load markers on map
  fetchMarkers();
}
