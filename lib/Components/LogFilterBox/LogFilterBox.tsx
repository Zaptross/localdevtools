import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import LogList from "../LogList/LogList";
import { Log } from "../SSEProvider/SSEProvider";

type Props = {
  unfiltered: Log[];
  setFiltered: Dispatch<SetStateAction<Log[]>>;
  id: string;
  label: string;
};

export default function FilterBox({
  id,
  label,
  unfiltered,
}: Props) {
  const [filtered, setFiltered] = useState<Log[]>(unfiltered);

  const doFiltering = (filter: string) => {
    if (filter.length > 0) {
      setFiltered(
        unfiltered.filter(
          (log) =>
            log.log.includes(filter) ||
            log.timestamp.toLocaleString().includes(filter)
        )
      );
    } else {
      setFiltered(unfiltered);
    }
  };

  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="text"
        onChange={(a) => doFiltering(a.target.value)}
      ></input>
        <LogList logs={filtered}></LogList>
    </>
  );
}
