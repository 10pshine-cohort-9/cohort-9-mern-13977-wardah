import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Signup from "../signup";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  Link: ({ children, to, className }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
  useNavigate: () => mockNavigate,
}));

describe("Signup Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    global.fetch = jest.fn();
  });

  const fillForm = ({
    name = "Wardah",
    email = "wardah@example.com",
    password = "secret123",
    confirmPassword = "secret123",
  } = {}) => {
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: name },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: email },
    });
    fireEvent.change(screen.getByLabelText(/^password/i), {
      target: { value: password },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: confirmPassword },
    });
  };

  it("renders all registration form fields", () => {
    render(<Signup />);

    expect(
      screen.getByRole("heading", { name: /join notely/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^sign up$/i }),
    ).toBeInTheDocument();
  });

  it("shows error when passwords do not match without calling api", () => {
    render(<Signup />);

    fillForm({ confirmPassword: "mismatch123" });
    fireEvent.click(screen.getByRole("button", { name: /^sign up$/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Passwords do not match",
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("handles successful signup and redirect", async () => {
    const mockUser = {
      id: "user-2",
      name: "Wardah",
      email: "wardah@example.com",
    };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: "mock-signup-jwt", user: mockUser }),
    });

    render(<Signup />);

    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /^sign up$/i }));

    await waitFor(() => {
      expect(localStorage.getItem("token")).toBe("mock-signup-jwt");
      expect(JSON.parse(localStorage.getItem("user"))).toEqual(mockUser);
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("displays API error message or default fallback on failed response", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    render(<Signup />);

    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /^sign up$/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Failed to create account",
      );
    });
  });

  it("displays error message when signup fetch throws network error", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network error"));

    render(<Signup />);

    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /^sign up$/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Failed to connect to server. Please try again.",
      );
    });
  });
});
