import type { NextApiRequest, NextApiResponse } from "next";
import type { DeleteQueryBuilder, Repository } from "typeorm";
import db, { KeyValue } from "../../lib/database";
import api, { status } from "../../lib/api";

let kvRepo: Repository<KeyValue>;

async function ensureKVRepo() {
  if (!kvRepo) {
    kvRepo = (await db).getRepository(KeyValue);
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await ensureKVRepo();

  switch (req.method) {
    case "GET":
      return await handleGet(req, res);
    case "POST":
      return await handlePost(req, res);
    case "DELETE":
      return await handleDelete(req, res);
    default:
      return api.NOT_FOUND(res);
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  if (!req.query.key || req.query.key?.length === 0) {
    res
      .status(status.BAD_REQUEST)
      .send("BAD REQUEST - missing required params");
    return;
  }

  const result = await kvRepo
    .createQueryBuilder("key_value")
    .where("key = :key", { key: req.query.key })
    .getOne();

  if (result !== null) {
    res.status(status.OK).json(result);
  } else {
    api.NOT_FOUND(res);
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  let bodyJSON: Partial<KeyValue> = {};
  if (!req.body?.key || !req.body?.value || req.body.length === 0) {
    res.status(status.BAD_REQUEST).send("BAD REQUEST - missing body");
    return;
  }

  if (req.body.key.length === 0 || req.body.value.length === 0) {
    res.status(status.BAD_REQUEST).send("BAD REQUEST - invalid key or value");
    return;
  }

  const kv = KeyValue.create({ key: req.body.key, value: req.body.value });

  const result = await kvRepo.upsert(kv, { conflictPaths: ["key"] });

  res.status(status.OK).send("OK");
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  if (!req.query.key || req.query.key?.length === 0) {
    res
      .status(status.BAD_REQUEST)
      .send("BAD REQUEST - missing required params");
    return;
  }

  const result = await kvRepo
    .createQueryBuilder("key_value")
    .delete()
    .from(KeyValue)
    .where("key = :key", { key: req.query.key })
    .execute();

  if (result !== null) {
    api.OK(res);
  } else {
    api.NOT_FOUND(res);
  }
}
