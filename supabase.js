// supabase.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Define Supabase URL and Key (Replace these with your actual credentials)
const SUPABASE_URL = "https://lrdrzttoghslrwoprasi.supabase.co"; // Replace with your actual Supabase URL
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyZHJ6dHRvZ2hzbHJ3b3ByYXNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcwNTk3MjAsImV4cCI6MjA1MjYzNTcyMH0.zGGMI8amEFNHWyvOdOjWiB3fMWWVhkt2-hcLl37XPTc"
// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Attach the Supabase client to the window object for access in other scripts
window.supabase = supabase;
