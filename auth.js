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
  
      console.log("Upsert response:", { data, error });
  
      if (error) {
        console.error("Upsert failed:", error.message);
      } else {
        console.log("Upsert successful:", data);
      }
    } catch (err) {
      console.error("Error in saveUserData:", err.message);
    }
  };
  

  // Sign-up form handler
  const signupForm = document.getElementById("signupModal");
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const { user, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: { data: { name } },
      });

      if (error) throw new Error(error.message);

      alert("Sign-up successful! Please check your email to confirm your account.");
      if (user && user.id) await saveUserData(user, name);
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
      if (user && user.id) await saveUserData(user, user.user_metadata.name);
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

      clearSessionData();
      alert("Signed out successfully!");
      window.location.href = "https://zambane.netlify.app/";
    } catch (err) {
      console.error("Sign-out error:", err.message);
      alert(err.message);
    }
  });

  // Clear session data
  function clearSessionData() {
    currentUser = null;
    console.log("Session data cleared");
  }

  // Update UI buttons based on authentication state
  function updateButtons() {
    const getStartedBtn = document.getElementById("getStartedBtn");
    const makeRequestBtn = document.getElementById("makeRequestBtn");

    if (currentUser) {
      getStartedBtn.style.display = "none";
      makeRequestBtn.style.display = "inline-block";
    } else {
      getStartedBtn.style.display = "inline-block";
      makeRequestBtn.style.display = "none";
    }
  }

  // Location save function
  async function saveLocation(latitude, longitude) {
    try {
      const { data, error } = await supabase
        .from("current_locations")
        .insert([
          {
            user_id: currentUser.id,
            latitude: latitude,
            longitude: longitude,
          },
        ]);

      if (error) throw new Error(error.message);
      console.log("Location data saved successfully:", data);
      alert("Your location has been saved successfully.");
    } catch (err) {
      console.error("Error saving location data:", err.message);
      alert("Failed to save your location. Please try again.");
    }
  }

  // Geolocation handling
  const makeRequestBtn = document.getElementById("makeRequestBtn");
  if (makeRequestBtn) {
    makeRequestBtn.addEventListener("click", () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => saveLocation(position.coords.latitude, position.coords.longitude),
          (error) => {
            console.error("Error getting location:", error.message);
            alert("Unable to retrieve your location. Please try again.");
          }
        );
      } else {
        alert("Geolocation is not available in your browser.");
      }
    });
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
