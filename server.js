import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import {signup, login, logout} from "./auth.js";
import supabase from "./supabase.js";
import {initTransaction, getTransactionStatus} from "./transbank.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Rutas de autenticación
app.post("/signup", async (req, res) => {
  const {fullName, email, password} = req.body;

  try {
    const data = await signup({fullName, email, password});
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});

app.post("/login", async (req, res) => {
  const {email, password} = req.body;

  try {
    const data = await login({email, password});
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});

app.post("/logout", async (req, res) => {
  try {
    await logout();
    res.status(200).json({message: "Logout successful"});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});
app.post("/api/transbank/init", initTransaction);
app.post("/api/transbank/status", getTransactionStatus);
// Ruta para obtener todos los productos
app.get("/products", async (req, res) => {
  try {
    const {data: products, error} = await supabase.from("products").select("*");
    if (error) throw error;
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

// Ruta para crear un nuevo producto
app.post("/products", async (req, res) => {
  const {name, description, price} = req.body;

  try {
    const {data: product, error} = await supabase
      .from("products")
      .insert([{name, description, price}])
      .single();
    if (error) throw error;
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Servidor Express escuchando en http://localhost:${port}`);
  });
}

export default app;
