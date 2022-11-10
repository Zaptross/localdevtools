import { ReactNode, useState } from "react";
import FilterBox from "../LogFilterBox/LogFilterBox";
import HideyButton from "../Button/HideyButton";
import SSEProvider, { Log } from "../SSEProvider/SSEProvider";
import useLoadTodaysLogs from "../../Hooks/LoadTodaysLogs/useLoadTodaysLogs";

type Props = {
  children?: ReactNode;
  logsCount: number;
};

export default function LogsView({ children, logsCount }: Props) {
  const [logs, setLogs] = useState<Log[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<Log[]>(logs);
  const [clicked, setClicked] = useState(false);
  const loadTodaysLogs = useLoadTodaysLogs();

  const onData = (d: Log) => {
    setLogs(logs.concat({ ...d, timestamp: new Date(d.timestamp) }));
  };

  const loadLogs = () => {
    setLogs(logs.concat(...loadTodaysLogs.logs).sort());
    setClicked(true);
  };

  return (
    <SSEProvider onData={onData}>
      <>
        {" "}
        <HideyButton clicked={clicked} onClick={() => loadLogs()}>
          {`Load ${logsCount} Older Logs From Today`}
        </HideyButton>
        <FilterBox
          id="filter-logs"
          label="Filter Logs:"
          setFiltered={setFilteredLogs}
          unfiltered={logs}
        />
      </>
    </SSEProvider>
  );
}
