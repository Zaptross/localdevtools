import { CSSProperties, ReactNode, useState } from "react";
import Button from "../Button/Button";

type Tab = {
  name: string;
  children: ReactNode;
};

type Props = {
  tabs: Tab[];
};

const darkGray = "#545252";

const tabStyles = (active: boolean): CSSProperties => ({
  margin: "0 0.2em 0 1em",
  backgroundColor: active ? "grey" : darkGray,
  borderColor: active ? "lightgrey" : "grey",
});

export default function TabsContainer({ tabs }: Props) {
  const [activeTab, setActiveTab] = useState(0);
  const [pinned, setPinned] = useState<boolean[]>(
    new Array(tabs.length).map(() => false)
  );

  return (
    <div
      className="fill-available"
      style={{ display: "flex", overflow: "hidden", paddingTop: "0.5em" }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: "none",
        }}
      >
        {tabs.map((tab, i) => (
          <span key={i} style={{alignSelf: "flex-end"}}>
            {" "}
            <Button
              style={tabStyles(activeTab === i || pinned[i])}
              key={i}
              onClick={() => setActiveTab(i)}
            >
              {tab.name}
            </Button>
            <Button
              style={{ backgroundColor: pinned[i] ? "red" : darkGray }}
              onClick={() => {
                const newPinned = pinned.slice();
                newPinned.splice(i, 1, !pinned[i]);
                setPinned(newPinned);

                if (activeTab === i && newPinned.filter((x) => x).length > 0) {
                  setActiveTab(
                    newPinned
                      .map((pinned, index) => ({ pinned, index }))
                      .find((p) => p.pinned)?.index || 0
                  );
                }
              }}
            >
              📌
            </Button>
          </span>
        ))}
      </div>
      {tabs
        .filter((_, i) => i === activeTab || pinned[i])
        .map((tab, i, arr) => (
          <div
            style={{
              marginLeft: "0.4em",
              padding: "0.4em",
              borderColor: darkGray,
              borderStyle: "solid",
              borderWidth: "0.1em",
              width: `${100 / arr.length}%`,
              overflow: "auto",
            }}
            key={i}
          >
            {tab.children}
          </div>
        ))}
    </div>
  );
}
