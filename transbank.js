// transbank.js
import fetch from "node-fetch";

const initTransaction = async (req, res) => {
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
};

//Funcion para obtener el estado de una transaccion

const getTransactionStatus = async (req, res) => {
  try {
    const {token} = req.body;

    if (!token) {
      console.error("Token no proporcionado");
      throw new Error("El token es requerido");
    }

    console.log("Token recibido:", token);

    const options = {
      commerceCode: "597055555532",
      apiKey:
        "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C",
      environment: "integration",
    };

    const response = await fetch(
      `https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions/${token}`,
      {
        method: "GET",
        headers: {
          "Tbk-Api-Key-Id": options.commerceCode,
          "Tbk-Api-Key-Secret": options.apiKey,
        },
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
    console.log("Estado de la transacción:", responseData);
    res.json(responseData);
  } catch (error) {
    console.error("Error al obtener el estado de la transacción:", error);
    res.status(500).json({
      message: "Error al obtener el estado de la transacción",
      error: error.message,
    });
  }
};

export {initTransaction, getTransactionStatus};
