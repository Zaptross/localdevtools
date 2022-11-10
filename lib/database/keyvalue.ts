import { Entity, PrimaryColumn, Column, BaseEntity } from "typeorm";
import { SSEEventType } from "../sse/sse";

@Entity()
export class KeyValue extends BaseEntity {
  @PrimaryColumn({ type: "text" })
  key: string;

  @Column({ type: "text" })
  value: string;

  toString = () => {
    return JSON.stringify({
      type: SSEEventType.DATA,
      key: this.key,
      value: this.value
    });
  };
}
