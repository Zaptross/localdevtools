import request from "../../Hooks/request/request";
import db from "../../../lib/database";
import { CSSProperties, useState } from "react";
import Button from "../Button/Button";

export type KeyValue = {
  key: string;
  value: string;
};

type Props = {
  kvs?: KeyValue[];
};

type GridlineParams = {
  key: string;
  value: string;
  index: number;
  update: (key: string, value: string) => void;
  deleteKey: (key: string) => void;
};

const inputStyle: CSSProperties = { margin: "0.5em 0.2em 0.5em 0.2em" };

const NewKVFields = (onCreate: (k: string, v: string) => void) => {
  const [k, setK] = useState("");
  const [v, setV] = useState("");
  const [targets, setTargets] = useState<HTMLInputElement[]>([]);

  return (
    <div>
      <input
        style={inputStyle}
        onChange={(a) => {
          setK(a.target.value);
          setTargets([a.target, targets[1]]);
        }}
      ></input>
      <input
        style={inputStyle}
        onChange={(a) => {
          setV(a.target.value);
          setTargets([targets[0], a.target]);
        }}
      ></input>
      <Button
        style={{ backgroundColor: "green" }}
        onClick={() => {
          onCreate(k, v);
          targets.forEach((t) => (t.value = ""));
        }}
      >
        ➕
      </Button>
    </div>
  );
};

const getGridline = ({
  key,
  value,
  index,
  update,
  deleteKey,
}: GridlineParams) => {
  return (
    <div style={{ margin: "0 auto" }} key={index}>
      <input value={key} style={inputStyle} readOnly />
      <input
        value={value}
        style={inputStyle}
        onChange={(a) => update(key, a.target.value)}
      />
      <Button style={{ backgroundColor: "red" }} onClick={() => deleteKey(key)}>
        🗑️
      </Button>
    </div>
  );
};

export default function KeyValueEditableGrid({ kvs }: Props) {
  if (!kvs?.length) {
    kvs = [];
  }
  const [keyValues, setKvs] = useState(kvs);

  const postUpdateToDb = (key: string, value: string) =>
    request.post({
      path: "/api/kv",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        key,
        value,
      },
    });

  const addNewKV = (k: string, v: string) => {
    setKvs(
      kvs!.concat({
        key: k,
        value: v,
      })
    );

    postUpdateToDb(k, v);
  };

  const deleteKey = (i: number, k: string) => {
    const newKvs = kvs!.slice();
    newKvs.splice(i, 1);
    setKvs(newKvs);

    request.delete({ path: "/api/kv", query: { key: k } });
  };

  const updateKeyValue = (index: number, key: string, value: string) => {
    const kvsCopy = keyValues.slice();
    kvsCopy[index].key = key;
    kvsCopy[index].value = value;

    setKvs(kvsCopy);

    postUpdateToDb(key, value);
  };

  return (
    <div>
      {NewKVFields(addNewKV)}
      {keyValues.map((kv, i) =>
        getGridline({
          ...kv,
          index: i,
          update: (k: string, v: string) => updateKeyValue(i, k, v),
          deleteKey: (k: string) => deleteKey(i, k),
        })
      )}
    </div>
  );
}
