import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post("/api/transbank/init", async (req, res) => {
  const {buyOrder, sessionId, amount, returnUrl} = req.body;

  const options = {
    commerceCode: "597055555532", // Asegúrate de usar tu código de comercio real
    apiKey: "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C", // Asegúrate de usar tu API Key real
    environment: "integration", // Cambia a 'production' en producción
  };

  // Validar el buyOrder
  const validatedBuyOrder = buyOrder.slice(0, 20).replace(/[^a-zA-Z0-9]/g, "");

  const data = {
    buy_order: validatedBuyOrder,
    session_id: sessionId,
    amount: amount,
    return_url: returnUrl,
  };

  try {
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

app.listen(port, () => {
  console.log(`Servidor Express escuchando en http://localhost:${port}`);
});

/*const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const {
  WebpayPlus,
  Options,
  IntegrationCommerceCodes,
  IntegrationApiKeys,
  Environment,
} = require("transbank-sdk");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

//Configuracion de las Opciones de integracion de Transbank.
const options = new Options(
  IntegrationCommerceCodes.WEBPAY_PLUS,
  IntegrationApiKeys.WEBPAY,
  Environment.Integration
);

//Ruta para iniciar la transaccion
app.post("/api/transbank/init", async (req, res) => {
  const {buyOrder, sessionId, amount, returnUrl} = req.body;

  try {
    const tx = new WebpayPlus.Transaction(options);
    const response = await tx.create(buyOrder, sessionId, amount, returnUrl);
    res.json(response);
  } catch (error) {
    console.error("Error initiating transaction:", error);
    res.status(500).send("Error initiating transaction");
  }
});

//Ruta de Retorno para confirma la tansaccion
app.post("/api/transbank/commit", async (req, res) => {
  const {token_ws} = req.body;

  try {
    const tx = new WebpayPlus.Transaction(options);
    const response = await tx.commit(token_ws);
    res.json(response);
  } catch (error) {
    console.error("Error committing transaction:", error);
    res.status(500).send("Error committing transaction");
  }
});

app.listen(PORT, () => {
  console.log("Server running on port ${PORT}");
});*/

//Prueba de Conexión a webpay
/*app.use(cors());
app.use(express.json());

//Mi ruta para iniciar la transaccion

app.post("/api/init-transaction", async (req, res) => {
  const buyOrder = "my-company-name-328493"; //Orden de compra unica.
  const sessionId = "Sesion123"; // ID de sesión
  const amount = 10000; // Monto en la moneda más pequeña
  const returnUrl = "http://localhost:5173/dashboard"; // URL de retorno después del pago

  const tx = new WebpayPlus.Transaction(
    new Options(
      IntegrationCommerceCodes.WEBPAY_PLUS,
      IntegrationApiKeys.WEBPAY,
      Environment.Integration
    )
  );

  try {
    const response = await tx.create(buyOrder, sessionId, amount, returnUrl);
    res.json({url: response.url, token: response.token});
  } catch (error) {
    res.status(500).json({error: "Error initiating transaction"});
  }
});

//Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port ${PORT}");
});*/
