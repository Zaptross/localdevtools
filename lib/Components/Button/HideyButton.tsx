import { ReactNode, useState } from "react";
import Button from "./Button";

type Props = {
  children: ReactNode;
  onClick: () => void;
  clicked: boolean;
};

export default function HideyButton({ onClick, children, clicked }: Props) {
  return (
    <div style={{ display: clicked ? "none" : "block" }}>
      <Button onClick={onClick}>{children}</Button>
    </div>
  );
}
