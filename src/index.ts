import http from "http";
import { onServerStart } from "~/utils";

const server = http.createServer((_, res) => {
  res.setHeader("Content-Type", "text/html");
  res.end("Hello world!");
});

const port = 8080;

server.listen(port, onServerStart(port));
