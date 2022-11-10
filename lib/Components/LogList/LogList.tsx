import { Log } from "../SSEProvider/SSEProvider";

type Props = {
  logs: Log[];
};

export default function LogList({ logs }: Props) {
  return (
    <div id="loglist">
      {logs
        .slice()
        .reverse()
        .map((l: Log, key) => (
          <p key={key}>
            <em>{l.timestamp.toLocaleTimeString()}</em>:{" "}
            {l.log.split("\\n").map((s, i) => (
              i ? <p key={i}>{s}</p> : s
            ))}
          </p>
        ))}
    </div>
  );
}
