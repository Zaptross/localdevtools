import type { NextApiRequest, NextApiResponse } from "next";

import { v4 as uuidv4 } from "uuid";
import logger from "../../lib/logger/logger";
import sse, { SSEEventType } from "../../lib/sse/sse";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Content-Encoding": "none",
    Connection: "keep-alive",
  });

  const client = { id: req.body?.uuid || uuidv4(), req, res };

  sse.register(client);

  logger.debug(`Client ${client.id} connected`);
  sse.sendTo(
    client.id,
    JSON.stringify({
      timestamp: new Date(),
      type: SSEEventType.MESSAGE,
      log: "Connected",
    })
  );

  setTimeout(() => {
    logger.debug(`Sending message to ${client.id}`);
    sse.sendTo(
      client.id,
      JSON.stringify({
        timestamp: new Date(),
        type: SSEEventType.MESSAGE,
        log: "Hello!",
      })
    );
  }, 5000);
}
