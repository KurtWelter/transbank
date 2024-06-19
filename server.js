import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import {signup, login, logout} from "./auth.js";
import supabase from "./supabase.js";

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

app.post("/api/transbank/init", async (req, res) => {
  try {
    const {buyOrder, sessionId, amount, returnUrl} = req.body;

    // Validar que todos los campos requeridos estén presentes
    if (!buyOrder || !sessionId || !amount || !returnUrl) {
      throw new Error("Todos los campos son requeridos");
    }

    // Validar y limpiar el campo buyOrder
    const validatedBuyOrder = buyOrder
      .slice(0, 20)
      .replace(/[^a-zA-Z0-9]/g, "");

    const options = {
      commerceCode: "597055555532",
      apiKey:
        "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C",
      environment: "integration",
    };

    const data = {
      buy_order: validatedBuyOrder,
      session_id: sessionId,
      amount: amount,
      return_url: returnUrl,
    };

    console.log("Iniciando transacción con los siguientes datos:", data);

    const response = await fetch(
      "https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions",
      {
        method: "POST",
        headers: {
          "Tbk-Api-Key-Id": options.commerceCode,
          "Tbk-Api-Key-Secret": options.apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error en la solicitud: ${response.statusText}`, errorText);
      throw new Error(
        `Error en la solicitud: ${response.statusText} - ${errorText}`
      );
    }

    const responseData = await response.json();
    console.log("Respuesta de Transbank:", responseData);
    res.json(responseData);
  } catch (error) {
    console.error("Error al iniciar la transacción:", error);
    res
      .status(500)
      .json({message: "Error al iniciar la transacción", error: error.message});
  }
});
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
