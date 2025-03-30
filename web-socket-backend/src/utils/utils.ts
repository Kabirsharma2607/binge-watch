import { WebSocket } from "ws";

export const messageParsingError = (ws: WebSocket) => {
  ws.send(
    JSON.stringify({
      type: "error",
      message: "Invalid join room data",
    })
  );
  return;
};
