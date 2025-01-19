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

      // Fetch and plot all locations after signing in
      updateButtons(); // Update buttons after successful sign-in
      // Reload the page after successful login
      window.location.reload();
      fetchAndPlotLocations();
    } else if (event === "SIGNED_OUT") {
      console.log("User signed out.");
      currentUser = null;
      updateButtons(); // Update buttons after successful sign-in
      // Optionally, clear the locations from the map when logged out
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });
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

      // Close the modal after successful login
      document.getElementById("signinModal").style.display = "none"; // Hide the modal

      alert("Sign-in successful!");

      // Update the UI to reflect login state
      currentUser = user;
      updateButtons();

      // Now you can make requests after successful login
      fetchAndPlotLocations(); // Optionally call any other methods for post-login actions

    } catch (err) {
      console.error("Sign-in error:", err.message);
      alert(err.message);
    }
  });


  // Sign-out handler
  const signoutBtn = document.getElementById("sign-out");
  signoutBtn.addEventListener("click", async () => {
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);

      // Clear all data from localStorage
      localStorage.clear(); // Clears all items in localStorage

      // Reset current user and log the sign-out
      currentUser = null;
      console.log("User signed out successfully.");

      // Alert the user
      alert("Signed out successfully!");

      // Optionally, redirect to another page after sign-out
      window.location.href = "https://zambane.netlify.app/"; // Redirect after sign-out (you can change the URL)
    } catch (err) {
      console.error("Sign-out error:", err.message);
      alert(err.message);
    }
  });


  // Update the UI buttons based on authentication state
  function updateButtons() {
    const getStartedBtn = document.getElementById("getStartedBtn");
    const makeRequestBtn = document.getElementById("makeRequestBtn");

    if (!getStartedBtn || !makeRequestBtn) {
      console.error("Buttons not found in the DOM. Ensure the button IDs are correct.");
      return;
    }

    // Update button visibility based on the authentication state
    if (currentUser) {
      getStartedBtn.style.display = "none"; // Hide the 'Get Started' button
      makeRequestBtn.style.display = "inline-block"; // Show the 'Make Request' button
    } else {
      getStartedBtn.style.display = "inline-block"; // Show the 'Get Started' button
      makeRequestBtn.style.display = "none"; // Hide the 'Make Request' button
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
            // Check if a location already exists for the current user
            const { data: existingLocation, error: fetchError } = await supabase
              .from("current_locations")
              .select("*")
              .eq("user_id", currentUser.id)
              .single();  // We expect a single entry (if exists)

            if (fetchError) {
              console.error("Error fetching existing location:", fetchError.message);
              alert("Failed to fetch existing location data.");
              return;
            }

            // If a location exists, update it, otherwise, insert new data
            const locationData = {
              user_id: currentUser.id,
              latitude,
              longitude,
            };

            let result;

            if (existingLocation) {
              // Update existing location if found
              const { data, error } = await supabase
                .from("current_locations")
                .update(locationData)
                .eq("user_id", currentUser.id);

              result = data;
              if (error) {
                console.error("Error updating location:", error.message);
                alert("Failed to update your location. Please try again.");
                return;
              }
            } else {
              // Insert new location if none exists
              const { data, error } = await supabase
                .from("current_locations")
                .upsert([locationData]);

              result = data;
              if (error) {
                console.error("Error saving location:", error.message);
                alert("Failed to save your location. Please try again.");
                return;
              }
            }

            console.log("Location saved/updated:", result);
            alert("Your location has been saved/updated successfully.");

            // After saving the location, fetch the coordinates and plot them
            fetchAndPlotLocations();
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


  // Fetch and plot coordinates for all users
  // Fetch and plot coordinates for all users only if the user is logged in
  async function fetchAndPlotLocations() {
    if (!currentUser) {
      alert("You need to be logged in to view locations.");
      return; // Exit the function if no user is logged in
    }

    try {
      // Fetch all locations from the current_locations table
      const { data: locations, error } = await supabase
        .from("current_locations")
        .select("latitude, longitude");

      if (error) {
        console.error("Error fetching locations:", error.message);
        alert("Failed to load locations.");
        return;
      }

      // Clear existing markers before plotting new ones
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      // Plot all locations on the map
      locations.forEach((location) => {
        const { latitude, longitude } = location;

        L.marker([latitude, longitude], {
          icon: L.icon({
            iconUrl: "./assets/markers/customer.jpg",
            iconSize: [30, 38],
            iconAnchor: [15, 50],
            popupAnchor: [0, -50],
          }),
        })
          .addTo(map)
          .bindPopup("<b>Location</b>");
      });
    } catch (err) {
      console.error("Error fetching locations:", err.message);
      alert("An error occurred while fetching locations.");
    }
  }


  // Initialize the map
  const map = L.map("map").setView([-25.5416, 28.0992], 13); // Centered in Soshanguve
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
  }).addTo(map);

  // Fetch and plot locations on map at the beginning
  fetchAndPlotLocations();


}
