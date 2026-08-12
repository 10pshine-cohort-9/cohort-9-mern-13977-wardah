import "dotenv/config";
import jwt from "jsonwebtoken";
import { expect } from "chai";
import request from "supertest";
import app from "../src/app.js";

describe("Notes API", () => {
  const token = jwt.sign(
    { userId: "507f1f77bcf86cd799439011" },
    process.env.JWT_SECRET,
  );

  it("should reject unauthenticated request", async () => {
    const response = await request(app).get("/api/notes");

    expect(response.status).to.equal(401);
  });

  it("should reject an invalid token", async () => {
    const response = await request(app)
      .get("/api/notes")
      .set("Authorization", "Bearer invalid-token");

    expect(response.status).to.equal(401);
  });

  it("should create a note successfully", async () => {
    const response = await request(app)
      .post("/api/notes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Note",
        content: "Testing note creation",
      });

    expect(response.status).to.equal(201);
    expect(response.body.message).to.equal("Note created successfully");
  });

  it("should reject note with invalid content type", async () => {
    const response = await request(app)
      .post("/api/notes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        content: 123,
      });

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal("Content must be a string");
  });

  it("should fetch notes successfully", async () => {
    const response = await request(app)
      .get("/api/notes")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal("Notes fetched successfully");
    expect(response.body.notes).to.be.an("array");
  });

  it("should fetch a note by id successfully", async () => {
    const createResponse = await request(app)
      .post("/api/notes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Note",
        content: "Testing get note by id",
      });

    const noteId = createResponse.body.note._id;

    const response = await request(app)
      .get(`/api/notes/${noteId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal("Note fetched successfully");
    expect(response.body.note._id).to.equal(noteId);
  });

  it("should update a note successfully", async () => {
    const createResponse = await request(app)
      .post("/api/notes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Original Title",
        content: "Original Content",
      });

    const noteId = createResponse.body.note._id;

    const response = await request(app)
      .put(`/api/notes/${noteId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Title",
        content: "Updated Content",
      });

    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal("Note updated successfully");
    expect(response.body.note.title).to.equal("Updated Title");
    expect(response.body.note.content).to.equal("Updated Content");
  });

  it("should delete a note successfully", async () => {
    const createResponse = await request(app)
      .post("/api/notes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Note to Delete",
        content: "This note will be deleted",
      });

    const noteId = createResponse.body.note._id;

    const response = await request(app)
      .delete(`/api/notes/${noteId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal("Note deleted successfully");
  });

  it("should not allow a user to access another user's note", async () => {
    const firstUserToken = jwt.sign(
      { userId: "507f1f77bcf86cd799439011" },
      process.env.JWT_SECRET,
    );

    const secondUserToken = jwt.sign(
      { userId: "507f1f77bcf86cd799439012" },
      process.env.JWT_SECRET,
    );

    const createResponse = await request(app)
      .post("/api/notes")
      .set("Authorization", `Bearer ${firstUserToken}`)
      .send({
        title: "Private Note",
        content: "This belongs to another user",
      });

    const noteId = createResponse.body.note._id;

    const response = await request(app)
      .get(`/api/notes/${noteId}`)
      .set("Authorization", `Bearer ${secondUserToken}`);

    expect(response.status).to.equal(404);
    expect(response.body.message).to.equal("Note not found");
  });
});
