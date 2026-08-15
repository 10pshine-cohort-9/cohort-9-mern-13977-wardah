import { expect } from "chai";
import request from "supertest";
import app from "../src/app.js";

describe("Health Check", () => {
  it("should return a successful response", async () => {
    const response = await request(app).get("/api/health");
    expect(response.status).to.equal(200);
  });
});
