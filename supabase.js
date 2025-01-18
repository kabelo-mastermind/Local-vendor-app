const SUPABASE_URL = "https://lrdrzttoghslrwoprasi.supabase.co"; // Replace with your actual Supabase URL
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyZHJ6dHRvZ2hzbHJ3b3ByYXNpIiwicm9sSI6ImFub24iLCJpYXQiOjE3MzcwNTk3MjAsImV4cCI6MjA1MjYzNTcyMH0.zGGMI8amEFNHWyvOdOjWiB3fMWWVhkt2-hcLl37XPTc"; // Replace with your actual Supabase Key

// Initialize the Supabase client
const supabase = window.supabase?.createClient(SUPABASE_URL, SUPABASE_KEY) ?? createClient(SUPABASE_URL, SUPABASE_KEY);

// Attach supabase to the global window object for reuse
window.supabase = supabase;
