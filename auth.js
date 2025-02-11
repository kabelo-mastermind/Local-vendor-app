if (!window.supabase) {
  console.error("Supabase client is not initialized. Please check your supabase.js configuration.");
  alert("Supabase client initialization failed.");
} else {
  const supabase = window.supabase;
  let currentUser = null;

  // Utility function to insert or update user data in the 'clients' table

const saveUserData = async (user) => {
  if (!user) return; // Ensure user is available

  try {
      const userData = {
          id: user.id, // Use Supabase User ID as primary key
          name: user.user_metadata?.name || "Anonymous",
          email: user.email,
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
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { name } },
        });

        if (error) throw new Error(error.message);

        alert("Sign-up successful! Please check your email to confirm your account.");

        // Save user to 'clients' table
        await saveUserData(data.user);

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

  const resetPasswordForm = document.getElementById("resetPasswordForm");

  resetPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const email = document.getElementById("resetEmail").value;
  
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
  
      if (error) throw new Error(error.message);
  
      alert("A password reset link has been sent to your email.");
    } catch (err) {
      console.error("Reset password error:", err.message);
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
      window.location.href = "https://zambane.co.za/"; // Redirect after sign-out (you can change the URL)
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
      alert("Reload the page or log in by pressing 'Get Started' to start making requests.");
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
              alert("products added to cart.");
              location.reload(); // ✅ Refresh the tab after already requested
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
            alert("Your request was made successfully.");

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


// ✅ Fetch and plot all user locations and products
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Fetch the logged-in user's session
    const { data: { session }, error } = await supabase.auth.getSession();

    // Check if the user is authenticated
    if (error) {
      console.error("Error getting session:", error.message);
      alert("An error occurred while checking your login status.");
      return;
    }

    if (!session?.user) { // Use optional chaining for safety
      console.log("User not logged in: Not fetching locations or products.");
      alert("Please log in to view locations and products."); // Inform the user
      return; // Exit if no user is logged in
    }

    console.log("User logged in:", session.user.email); // Debugging log

    // Fetch and plot locations only if the user is authenticated
    await fetchAndPlotLocations();  // No need to pass user ID anymore

  } catch (err) {
    console.error("Error in session check:", err.message);
    alert("An unexpected error occurred while checking the session.");
  }
});

// ✅ Fetch and plot all user locations and products (only if the user is logged in)
async function fetchAndPlotLocations() {
  // Add session check here
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return;

  try {
    // ✅ Fetch locations from 'current_locations' table (all users' locations)
    const { data: locations, error: locationError } = await supabase
        .from("current_locations")
        .select("latitude, longitude, user_id"); // Fetch all users' locations

    if (locationError) {
        console.error("Error fetching locations:", locationError.message);
        alert("Failed to load locations.");
        return;
    }

    // ✅ Fetch selected products for all users from 'products' table
    const { data: products, error: productError } = await supabase
        .from("products")
        .select("name, user_id")
        .eq("selected", true); // Only fetch selected products

    if (productError) {
        console.error("Error fetching products:", productError.message);
        return;
    }

    // ✅ Clear existing markers before adding new ones
    map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    // ✅ Custom Leaflet marker icon
    const customIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    // ✅ Loop through locations and add markers for all users
    locations.forEach((location) => {
        const { latitude, longitude, user_id } = location;

        // Find all products for this user
        const userProducts = products
            .filter(product => product.user_id === user_id)
            .map(product => product.name)
            .join(", "); // Convert array to comma-separated string

        // ✅ Popup content
        const popupContent = userProducts.length > 0
            ? `<b>Products:</b> ${userProducts}`
            : "No products requested.";

        // ✅ Add marker to the map for all users
        L.marker([latitude, longitude], { icon: customIcon })
            .addTo(map)
            .bindPopup(popupContent);
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
        // Step 1: Delete associated products first
        const { error: productError } = await supabase
            .from("products")
            .delete()
            .eq("user_id", currentUser.id);

        if (productError) {
            console.error("Error deleting products:", productError.message);
            alert("Failed to remove selected products. Please try again.");
            return;
        }

        // Step 2: Delete the location after products are removed
        const { error: locationError } = await supabase
            .from("current_locations")
            .delete()
            .eq("user_id", currentUser.id);

        if (locationError) {
            console.error("Error deleting request:", locationError.message);
            alert("Failed to remove your request. Please try again.");
            return;
        }

        alert("Your request and selected products have been successfully removed.");

        // Refresh the map to remove the marker
        fetchAndPlotLocations();
        location.reload(); // ✅ Refresh the page to remove the products

    } catch (err) {
        console.error("Error stopping request:", err.message);
        alert("An error occurred while stopping your request.");
    }
}


  // Select all product cards
  document.addEventListener("DOMContentLoaded", async () => {
    const productCards = document.querySelectorAll('.blog-card');
    let selectedProducts = new Set();
    
    // Fetch the current user's session from Supabase Auth
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        console.error("User not authenticated. Please log in.");
        return;
    }

    const userId = user.id;

    // ✅ Step 1: Fetch previously selected products from Supabase
    try {
        const { data: existingProducts, error } = await supabase
            .from("products")
            .select("name")
            .eq("user_id", userId)
            .eq("selected", true); // Only get selected products

        if (error) throw error;

        // ✅ Step 2: Mark them as selected in the UI
        existingProducts.forEach(({ name }) => {
            selectedProducts.add(name);
            const card = document.querySelector(`[data-product-name="${name}"]`);
            if (card) card.classList.add('selected');
        });

    } catch (err) {
        console.error("Error fetching selected products:", err.message);
    }

    // ✅ Step 3: Add event listeners for product selection
    productCards.forEach(card => {
        card.addEventListener('click', async () => {
            const productName = card.getAttribute('data-product-name');

            if (selectedProducts.has(productName)) {
                selectedProducts.delete(productName);
                card.classList.remove('selected');

                // ✅ DELETE the product from Supabase when unselected
                try {
                    const { error } = await supabase
                        .from("products")
                        .delete()
                        .eq("name", productName)
                        .eq("user_id", userId);

                    if (error) throw error;

                    console.log(`Product '${productName}' deleted.`);
                    location.reload(); // ✅ Refresh the tab after deletion

                } catch (err) {
                    console.error("Error deleting product:", err.message);
                }

            } else {
                selectedProducts.add(productName);
                card.classList.add('selected');

                // ✅ INSERT the selected product into Supabase
                try {
                    const { data, error } = await supabase
                        .from("products")
                        .upsert([{ name: productName, selected: true, user_id: userId }], { onConflict: ['name', 'user_id'] });

                    if (error) throw error;
                    console.log(`Product '${productName}' saved:`, data);

                } catch (err) {
                    console.error("Error saving selected product:", err.message);
                }
            }
        });
    });
});



// Function to insert/update selected products in Supabase
async function saveSelectedProducts(selectedProducts) {
    try {
        const { data, error } = await supabase
            .from('products') // Replace with your actual table name
            .upsert(selectedProducts.map(product => ({
                name: product, // Assuming 'name' is the column for product names
                selected: true, // Add a column in your table to track selection
            })));

        if (error) {
            console.error("Error saving selected products:", error.message);
        } else {
            console.log("Products successfully saved:", data);
        }
    } catch (err) {
        console.error("Error:", err.message);
    }
}


// document.addEventListener("DOMContentLoaded", () => {
  const feedbackForm = document.getElementById("feedbackForm");
  const feedbackSuccessMessage = document.getElementById("feedbackSuccessMessage");

  feedbackForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent page refresh

    if (!currentUser) {
      alert("Please log in to submit feedback.");
      return;
    }

    const feedbackMessage = document.getElementById("feedbackMessage").value.trim();

    if (!feedbackMessage) {
      alert("Please enter your feedback before submitting.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("feedback")
        .insert([
          {
            user_id: currentUser.id, // Assuming currentUser contains the logged-in user's ID
            message: feedbackMessage,
          },
        ]);

      if (error) {
        console.error("Error submitting feedback:", error.message);
        alert("Failed to submit feedback. Please try again.");
        return;
      }

      console.log("Feedback submitted successfully:", data);
      feedbackSuccessMessage.style.display = "block"; // Show success message
      feedbackForm.reset(); // Clear the form after submission

      // Close modal automatically after 2 seconds
      setTimeout(() => {
        feedbackSuccessMessage.style.display = "none";
        document.getElementById("feedbackModal").style.display = "none";
      }, 2000);
      
    } catch (err) {
      console.error("Error submitting feedback:", err.message);
      alert("An unexpected error occurred. Please try again.");
    }
  });
// });



  // Initialize the map
  const map = L.map("map").setView([-25.5416, 28.0992], 13); // Default view
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
  }).addTo(map);

  // Fetch and plot locations on map at the beginning
  fetchAndPlotLocations();


}
