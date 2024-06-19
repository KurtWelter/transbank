import {signup, login, logout} from "../../auth.js";
import supabase from "../../supabase.js";

jest.mock("../../supabase.js", () => ({
  auth: {
    signUp: jest.fn(),
    signInWithPassword: jest.fn(),
    signOut: jest.fn(),
  },
}));

describe("Auth API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should signup a new user", async () => {
    const mockUserData = {
      id: "user-id-123",
      fullName: "Test User",
      email: "test@example.com",
      avatar: "",
    };

    supabase.auth.signUp.mockResolvedValue({data: mockUserData, error: null});

    const result = await signup({
      fullName: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    expect(result).toEqual(mockUserData);
  });

  it("should login an existing user", async () => {
    const mockUserData = {
      id: "user-id-123",
      fullName: "Test User",
      email: "test@example.com",
      avatar: "",
    };

    supabase.auth.signInWithPassword.mockResolvedValue({
      data: mockUserData,
      error: null,
    });

    const result = await login({
      email: "test@example.com",
      password: "password123",
    });

    expect(result).toEqual(mockUserData);
  });

  it("should logout a user", async () => {
    supabase.auth.signOut.mockResolvedValue({error: null});

    const result = await logout();

    expect(result).toBeUndefined();
  });
});
