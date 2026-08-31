import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../Login";

describe("Login Page", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("renders login form correctly", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /login|sign in/i }),
    ).toBeInTheDocument();
  });

  it("handles successful login and stores session", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: "mock-token",
        user: { id: "1", email: "test@example.com" },
      }),
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login|sign in/i }));

    try {
      await waitFor(() => {
        expect(localStorage.getItem("token")).toBe("mock-token");
      });
    } catch (error) {
      throw new Error(`Successful login assertion failed: ${error.message}`);
    }
  });

  it("handles server error response", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Invalid credentials" }),
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login|sign in/i }));

    try {
      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    } catch (error) {
      throw new Error(
        `Server error response assertion failed: ${error.message}`,
      );
    }
  });

  it("handles network failure gracefully", async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error("Network Error"));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login|sign in/i }));

    try {
      await waitFor(() => {
        expect(
          screen.getByText(/network error|something went wrong/i),
        ).toBeInTheDocument();
      });
    } catch (error) {
      throw new Error(`Network failure assertion failed: ${error.message}`);
    }
  });
});
