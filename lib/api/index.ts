import type { NextApiRequest, NextApiResponse } from "next";

export const status = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
};

const helpers = {
  OK: (res: NextApiResponse) => res.status(status.OK).send("OK"),
  BAD_REQUEST: (res: NextApiResponse) =>
    res.status(status.BAD_REQUEST).send("BAD REQUEST"),
  NOT_FOUND: (res: NextApiResponse) =>
    res.status(status.NOT_FOUND).send("NOT FOUND"),
};

export default helpers;
