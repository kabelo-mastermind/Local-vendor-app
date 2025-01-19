if (!window.supabase) {
  console.error("Supabase client is not initialized. Please check your supabase.js configuration.");
  alert("Supabase client initialization failed.");
} else {
  const supabase = window.supabase;
  let currentUser = null;

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

      // Save user data in the 'users' table after sign-up
      const { data, error: insertError } = await supabase
        .from("users")
        .insert([
          {
            id: user.id,
            name: name,
            email: email,
            password: password, // Consider hashing the password before storing it in production
          },
        ]);

      if (insertError) {
        console.error("Error inserting user data into the database:", insertError.message);
        alert("There was an error saving your user data. Please try again.");
      } else {
        console.log("User data saved successfully:", data);
      }
    }
  });

  // Sign-in form handler
  const signinForm = document.getElementById("signinModal");
  signinForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("signinEmail").value;
    const password = document.getElementById("signinPassword").value;

    const { user, session, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Sign-in successful!");
      // Close all modals
      const modals = document.querySelectorAll(".modal");
      modals.forEach((modal) => {
        modal.style.display = "none";
      });
    }
  });

  // Sign-out button handler
  const signoutBtn = document.getElementById('sign-out');
  signoutBtn.addEventListener('click', async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(error.message);
    } else {
      clearSessionData();
      alert('Signed out successfully!');
      window.location.href = 'https://zambane.netlify.app/';
    }
  });

  // Clear session data
  function clearSessionData() {
    currentUser = null;
    // Clear any other session-related data here
    console.log('Session data cleared');
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
    } else {
      currentUser = null;
      console.log("User is not logged in.");
    }
    updateButtons();
  })();


  // Get current location and store in Supabase
  if (makeRequestBtn) {
    makeRequestBtn.addEventListener("click", async () => {
      // Check if geolocation is available
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            // Save location to Supabase
            const { data, error } = await supabase
              .from("current_locations")
              .insert([
                {
                  user_id: currentUser.id,  // Assuming currentUser is set after login
                  latitude: latitude,
                  longitude: longitude,
                },
              ]);

            if (error) {
              console.error("Error saving location data:", error.message);
              alert("There was an error saving your location. Please try again.");
            } else {
              console.log("Location data saved successfully:", data);
              alert("Your location has been saved successfully.");
            }
          },
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

  // Initialize the map
  var map = L.map('map').setView([-25.5416, 28.0992], 13); // Centered in Soshanguve
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Fetch customer coordinates from Supabase
  async function fetchMarkers() {
      // Fetch customer data
      const { data: customers, error: customerError } = await supabase
          .from('current_locations') // Replace with your actual table name
          .select('latitude, longitude'); // Assuming these are the columns for coordinates

      if (customerError) {
          console.error("Error fetching current locations:", customerError);
          alert("Failed to fetch customer data. Please try again later.");
          return;
      }

      // Add customer markers
      customers.forEach(customer => {
          L.marker([customer.latitude, customer.longitude], { 
              icon: L.icon({
                  iconUrl: './assets/markers/customer.jpg',
                  iconSize: [30, 38],
                  iconAnchor: [15, 50],
                  popupAnchor: [0, -50]
              }) 
          })
          .addTo(map)
          .bindPopup("<b>Customer</b>");
      });
  }

  // Call the function to fetch markers from Supabase
  fetchMarkers();
  // Forgot Password Form Handler (optional)
  // Similar logic can be added if you want to implement this functionality
  // ...
}
