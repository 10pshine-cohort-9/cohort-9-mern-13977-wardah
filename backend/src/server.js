import "dotenv/config";
import app from "./app.js";

dotenv.config();

const parsedPort = Number(process.env.PORT);
let PORT;

if (Number.isNaN(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
  PORT = 3000;
} else {
  PORT = parsedPort;
}
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
