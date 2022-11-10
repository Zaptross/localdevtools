import react, { ReactNode, useState, CSSProperties } from "react";

type Props = {
  onClick: () => void;
  children: ReactNode;
  style?: CSSProperties
};

export default function Button({ style, children, onClick }: Props) {
  return <button style={style} onClick={onClick}>{children}</button>;
}
