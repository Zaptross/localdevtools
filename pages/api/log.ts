import type { NextApiRequest, NextApiResponse } from "next";
import type { Repository } from "typeorm";
import db, { Log } from "../../lib/database";
import sse, { SSEEventType } from "../../lib/sse/sse";

let logrepo: Repository<Log>;

async function ensureLogRepo() {
  if (!logrepo) {
    logrepo = (await db).getRepository(Log);
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await ensureLogRepo();

  switch (req.method) {
    case "GET":
      return await handleGet(req, res);
    case "POST":
      return await handlePost(req, res);
    default:
      return res.status(404).send("NOT FOUND");
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const todaysLogs = await logrepo
    .createQueryBuilder("log")
    .where("log.timestamp >= :yesterday", {
      yesterday: new Date(Date.now() - 12 * 60 * 60_000),
    })
    .getMany();

  res.status(200).json({
    logs: todaysLogs.map((log: Log) => ({
      log: log.log,
      timestamp: log.timestamp,
    })),
  });
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  if (req.body?.length > 0) {
    res.status(200).send("OK");
  } else {
    res.status(400).send("BAD REQUEST");
    return;
  }

  const log = logrepo.create({
    timestamp: new Date(),
    log: req.body as string,
  });

  log.save();
  sse.sendAll(log);
}
