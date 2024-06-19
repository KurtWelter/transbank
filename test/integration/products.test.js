import assert from "assert";
import request from "supertest";
import app from "../../server.js";
import supabase from "../../supabase.js";

jest.mock("../../supabase.js", () => ({
  from: jest.fn(),
}));

describe("Products API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should get all products", async () => {
    const mockProducts = [
      {id: 1, name: "Product 1", description: "Description 1", price: 10.99},
      {id: 2, name: "Product 2", description: "Description 2", price: 15.99},
    ];

    supabase.from.mockReturnValue({
      select: jest.fn().mockResolvedValue({data: mockProducts, error: null}),
    });

    const res = await request(app).get("/products");

    assert.strictEqual(res.status, 200);
    assert.deepStrictEqual(res.body, mockProducts);
  });

  it("should create a new product", async () => {
    const productData = {
      name: "New Product",
      description: "This is a new product",
      price: 15.99,
    };

    const mockProduct = {...productData, id: 1};

    supabase.from.mockReturnValue({
      insert: jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({data: mockProduct, error: null}),
      }),
    });

    const res = await request(app).post("/products").send(productData);

    assert.strictEqual(res.status, 201);
    assert.deepStrictEqual(res.body, mockProduct);
  });
});
