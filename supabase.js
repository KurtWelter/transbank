import {createClient} from "@supabase/supabase-js";

const supabaseUrl = "https://ktwfuspublsbvwuoxzvf.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0d2Z1c3B1YmxzYnZ3dW94enZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUyODc3NDgsImV4cCI6MjAzMDg2Mzc0OH0.L3i_M7gZfNqwnTqM8Y4HBYamVmCj0FcKQvcfExeGHBo";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
