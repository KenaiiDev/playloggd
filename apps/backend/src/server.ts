import { app } from "./app";

process.loadEnvFile();

const port = process.env.PORT || 3333;

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
  });
});

export { server };
