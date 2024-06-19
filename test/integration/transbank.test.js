import supertest from "supertest";
import app from "../../server.js";

describe("Transbank Integration", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });
  it("should initiate a transaction successfully", async () => {
    const transactionData = {
      buyOrder: "1234567890",
      sessionId: "session123",
      amount: 10000,
      returnUrl: "https://example.com/return",
    };

    fetch.mockResponseOnce(JSON.stringify({}));

    const response = await supertest(app)
      .post("/api/transbank/init")
      .send(transactionData);

    expect(response.status).toBe(200);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      "https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Tbk-Api-Key-Id": "597055555532",
          "Tbk-Api-Key-Secret":
            "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C",
        },
        body: JSON.stringify({
          buy_order: "1234567890",
          session_id: "session123",
          amount: 10000,
          return_url: "https://example.com/return",
        }),
      })
    );
  });

  it("should handle transaction initiation failure", async () => {
    const transactionData = {
      sessionId: "session123",
      amount: 10000,
      returnUrl: "https://example.com/return",
    };

    const response = await supertest(app)
      .post("/api/transbank/init")
      .send(transactionData);

    expect(response.status).toBe(500);
    expect(fetch).not.toHaveBeenCalled();
  });
});
