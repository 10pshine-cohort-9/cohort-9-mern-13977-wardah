import { expect } from "chai";
import request from "supertest";
import app from "../src/app.js";
describe("Signup", () => {
  it("should reject invalid input", async () => {
    const response = await request(app).post("/api/auth/signup").send({
      name: 123,
      email: "invalid-email",
      password: "short",
    });
    expect(response.status).to.equal(400);
  });

  it("should create a user successfully", async () => {
    const response = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Test User",
        email: `test-${Date.now()}@example.com`,
        password: "password123",
      });

    expect(response.status).to.equal(201);
    expect(response.body.message).to.equal("User is successfully created");
    expect(response.body.user).to.have.property("id");
    expect(response.body.user.email).to.include("@example.com");
    expect(response.body).to.have.property("token");
  });

  it("should reject duplicate email", async () => {
    const email = `duplicate-${Date.now()}@example.com`;

    await request(app).post("/api/auth/signup").send({
      name: "Test User",
      email,
      password: "password123",
    });

    const response = await request(app).post("/api/auth/signup").send({
      name: "Another User",
      email,
      password: "password123",
    });

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal("Email already exists");
  });

  it("should reject missing required fields", async () => {
    const response = await request(app).post("/api/auth/signup").send({
      name: "Test User",
    });

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal(
      "Name, email, and password must be strings",
    );
  });
});

describe("Login", () => {
  it("should reject invalid input", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: 123,
      password: "password123",
    });

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal(
      "Email and password must be strings",
    );
  });

  it("should reject login for a non-existing user", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: `nonexistent-${Date.now()}@example.com`,
        password: "password123",
      });

    expect(response.status).to.equal(401);
    expect(response.body.message).to.equal("Invalid email or password");
  });

  it("should reject an incorrect password", async () => {
    const email = `login-${Date.now()}@example.com`;

    await request(app).post("/api/auth/signup").send({
      name: "Login Test User",
      email,
      password: "password123",
    });

    const response = await request(app).post("/api/auth/login").send({
      email,
      password: "wrongpassword",
    });

    expect(response.status).to.equal(401);
    expect(response.body.message).to.equal("Invalid email or password");
  });

  it("should login successfully with valid credentials", async () => {
    const email = `success-login-${Date.now()}@example.com`;
    const password = "password123";

    await request(app).post("/api/auth/signup").send({
      name: "Login Test User",
      email,
      password,
    });

    const response = await request(app).post("/api/auth/login").send({
      email,
      password,
    });

    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal("User is successfully logged in");
    expect(response.body.user).to.have.property("id");
    expect(response.body.user.email).to.equal(email);
    expect(response.body).to.have.property("token");
  });
});

describe("Logout", () => {
  it("should logout successfully", async () => {
    const email = `logout-${Date.now()}@example.com`;
    const password = "password123";

    const signupResponse = await request(app).post("/api/auth/signup").send({
      name: "Logout Test User",
      email,
      password,
    });

    const token = signupResponse.body.token;

    const response = await request(app)
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal("User is successfully logged out");
  });

  it("should reject a token after logout", async () => {
    const email = `logout-check-${Date.now()}@example.com`;
    const password = "password123";

    const signupResponse = await request(app).post("/api/auth/signup").send({
      name: "Logout Test User",
      email,
      password,
    });

    const token = signupResponse.body.token;

    await request(app)
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${token}`);

    const response = await request(app)
      .get("/api/notes")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).to.equal(401);
    expect(response.body.message).to.equal("Invalid or expired token");
  });
});
