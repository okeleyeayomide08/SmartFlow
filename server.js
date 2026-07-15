import app from "./src/app.js";
import env from "./src/config/env.js";

const PORT = env.port;

app.listen(PORT, () => {
  console.log(`SmartFlow server is running on port http://localhost:${PORT}`);
});
