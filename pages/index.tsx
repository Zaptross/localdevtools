import { useState } from "react";
import db, { KeyValue, Log as DBLog } from "../lib/database";
import TabsContainer from "../lib/Components/TabsContainer/TabsContainer";
import KeyValueEditableGrid, {
  KeyValue as FEKeyValue,
} from "../lib/Components/KeyValueEditableGrid/KeyValueEditableGrid";
import LogsView from "../lib/Components/LogsView/LogsView";

type Props = {
  logsCount: number;
  kvs: FEKeyValue[];
};

export async function getStaticProps(): Promise<{ props: Props }> {
  const database = await await db;
  const logsCountPromise = database
    .getRepository(DBLog)
    .createQueryBuilder("log")
    .where("log.timestamp >= :yesterday", {
      yesterday: new Date(Date.now() - 12 * 60 * 60_000),
    })
    .getCount();

  const kvsPromise = database
    .getRepository(KeyValue)
    .createQueryBuilder("key_value")
    .getMany()
    .then((result) => result.map((kv) => ({ key: kv.key, value: kv.value })));

  const [logsCount, kvs] = await Promise.all([logsCountPromise, kvsPromise]);

  return {
    props: {
      logsCount,
      kvs,
    },
  };
}

export default function Home({ logsCount, kvs }: Props) {
  return (
      <TabsContainer
        tabs={[
          {
            name: "keys & values",
            children: <KeyValueEditableGrid kvs={kvs}></KeyValueEditableGrid>,
          },
          {
            name: "logs",
            children: (
              <LogsView logsCount={logsCount}/>
            ),
          },
        ]}
      ></TabsContainer>
  );
}
