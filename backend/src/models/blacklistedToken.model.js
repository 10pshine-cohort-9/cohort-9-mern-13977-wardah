import mongoose from "mongoose";
const blacklistedTokenSchema = new mongoose.Schema(
  {
    tokenHash: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
blacklistedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
const BlacklistedToken = mongoose.model(
  "BlacklistedToken",
  blacklistedTokenSchema,
);

export default BlacklistedToken;
