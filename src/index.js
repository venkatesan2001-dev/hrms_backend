import { createApp } from "./app.js";

const PORT = process.env.PORT || 8000;
const app = createApp();
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
