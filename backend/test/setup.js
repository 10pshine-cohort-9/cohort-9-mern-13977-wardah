import "dotenv/config";
import dns from "node:dns";
import mongoose from "mongoose";
if (process.env.DNS_FALLBACK === "true") {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
}
before(async () => {
  await mongoose.connect(process.env.TEST_MONGO_URI);
});

after(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});
