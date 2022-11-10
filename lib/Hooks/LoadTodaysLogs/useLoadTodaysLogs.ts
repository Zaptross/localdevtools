import { useEffect, useState } from "react";
import { Log } from "../../Components/SSEProvider/SSEProvider";

type LogsGetResponse = {
  logs: Log[];
};

export default function useLoadTodaysLogs() {
  const [data, setData] = useState({ logs: [] } as LogsGetResponse);

  useEffect(() => {
    (async () => {
      const response = await fetch("/api/log", { method: "get" });

      if (response.status === 200) {
        const json = (await response.json()) as LogsGetResponse;
        const data = {
          logs: json.logs.map((l) => {
            return { ...l, timestamp: new Date(l.timestamp) };
          }),
        };
        setData(data);
      }
    })();
  }, []);

  return data;
}
