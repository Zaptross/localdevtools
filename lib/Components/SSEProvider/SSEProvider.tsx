import { SSEEventType } from "../../../lib/sse/sse";
import { ReactNode, createContext, useEffect, useState } from "react";

export type Log = {
  type: SSEEventType.DATA;
  timestamp: Date;
  log: string;
};

type Props = {
  children: ReactNode;
  onData: (a: Log) => void;
};

export default function SSEProvider({ children, onData }: Props) {
  const SSEContext = createContext<EventSource | undefined>(undefined);
  const [eventSource, setEventSource] = useState<EventSource | undefined>(
    undefined
  );

  useEffect(() => {
    const es = new EventSource("/api/sse", { withCredentials: true });
    setEventSource(es);
    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === SSEEventType.DATA) {
          onData(data);
        }
      } catch (error) {
        const e = error as Error;
        console.error(e);
      }
    };
    return () => es.close();
  }, [onData]);

  return (
    <SSEContext.Provider value={eventSource}>{children}</SSEContext.Provider>
  );
}
