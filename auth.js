import supabase from "./supabase.js";

export async function signup({fullName, email, password}) {
  const {data, error} = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullName,
        avatar: "",
        discountApplied: true, // Agregar campo para indicar que se aplicó el descuento
      },
    },
  });

  if (error) throw new Error(error.message);
  return data;
}

export async function login({email, password}) {
  const {data, error} = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);
  return data;
}

export async function logout() {
  const {error} = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}
