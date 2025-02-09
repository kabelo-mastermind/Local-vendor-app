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

      alert("Sign-in successful refresh page!");

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
      alert("Reload the page or log in by pressing 'Get Started' to make a request.");
      return;
    }

    // Check if geolocation is available
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          console.log("Current Location:", latitude, longitude);
          // Update map view to the current location
          map.setView([latitude, longitude], 13); // Update map center to user's location

          try {
            // Check if a location already exists for the current user
            const { data: existingLocation, error: fetchError } = await supabase
              .from("current_locations")
              .select("*")
              .eq("user_id", currentUser.id)
              .maybeSingle(); // Prevents an error when no record is found

            if (fetchError) {
              console.error("Error fetching existing location:", fetchError.message);
              alert("Failed to check existing request.");
              return;
            }

            // If a location exists, notify the user and return
            if (existingLocation) {
              alert("Location already requested.");
              return;
            }

            // Insert new location since no existing record was found
            const locationData = {
              user_id: currentUser.id,
              latitude,
              longitude,
            };

            const { data, error } = await supabase
              .from("current_locations")
              .insert([locationData]); // Use insert() instead of upsert() to avoid updating existing records

            if (error) {
              console.error("Error saving location:", error.message);
              alert("Failed to save your location. Please try again.");
              return;
            }

            console.log("Location saved:", data);
            alert("Your location has been saved successfully.");

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
      // alert("Press get started, Sign in and refresh page then request");
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

      // Define a custom Leaflet icon
      const customIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png', // Leaflet's default marker from CDN
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      // Loop through locations and add markers with the custom icon
      locations.forEach((location) => {
        const { latitude, longitude } = location;

        L.marker([latitude, longitude], { icon: customIcon })  // Use the custom icon
          .addTo(map)
          .bindPopup('A pretty CSS popup.<br> Easily customizable.');
      });


    } catch (err) {
      console.error("Error fetching locations:", err.message);
      alert("An error occurred while fetching locations.");
    }
  }

  const stopRequestBtn = document.getElementById("stopRequestBtn");

  if (stopRequestBtn) {
    stopRequestBtn.addEventListener("click", deleteRequest);
  }

  async function deleteRequest() {
    if (!currentUser) {
      alert("You must be logged in to stop your request.");
      return;
    }

    try {
      const { error } = await supabase
        .from("current_locations")
        .delete()
        .eq("user_id", currentUser.id);

      if (error) {
        console.error("Error deleting request:", error.message);
        alert("Failed to remove your request. Please try again.");
        return;
      }

      alert("Your request has been successfully removed.");

      // Refresh the map to remove the marker
      fetchAndPlotLocations();
    } catch (err) {
      console.error("Error stopping request:", err.message);
      alert("An error occurred while stopping your request.");
    }
  }


  // Select all product cards
  document.addEventListener("DOMContentLoaded", () => {
    // Select all product cards
    const productCards = document.querySelectorAll('.blog-card');
    let selectedProductName = null;

    // Event listener for product cards
    productCards.forEach(card => {
      card.addEventListener('click', () => {
        // Store the clicked product name
        selectedProductName = card.getAttribute('data-product-name');
        console.log('Selected Product:', selectedProductName);

        // Toggle 'selected' class for visual indication
        productCards.forEach(c => c.classList.remove('selected')); // Remove from others
        card.classList.add('selected'); // Add to clicked one
      });
    });
  });


  // Initialize the map
  const map = L.map("map").setView([-25.5416, 28.0992], 13); // Default view
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
  }).addTo(map);

  // Fetch and plot locations on map at the beginning
  fetchAndPlotLocations();


}
