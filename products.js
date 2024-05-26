// products.js
import supabase from "./supabase.js";

export async function getProducts() {
  const {data, error} = await supabase.from("products").select("*");

  if (error) {
    console.error(error);
    throw new Error("Products could not be loaded");
  }

  return data;
}

export async function createProduct(newProduct) {
  const {data, error} = await supabase
    .from("products")
    .insert([newProduct])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Product could not be created");
  }

  return data;
}
