import { DataSourceOptions, DataSource } from "typeorm";
import { KeyValue } from "./keyvalue";
import { Log } from "./log";

let db: DataSource;

const options: DataSourceOptions = {
  type: "sqlite",
  database: `${process.env.SQLITE_DB_LOCATION}/db.sqlite`,
  entities: [Log, KeyValue],
  synchronize: true,
};

export const initialise = async () => {
  if (db) return db;

  db = new DataSource(options);

  await db.initialize();

  return db;
};

export default initialise();

export * from "./log";
export * from "./keyvalue";
