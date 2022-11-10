import { Entity, PrimaryColumn, Column, BaseEntity } from "typeorm";
import { SSEEventType } from "../sse/sse";

@Entity()
export class Log extends BaseEntity {
  @PrimaryColumn({ type: "datetime" })
  timestamp: Date;

  @Column({ type: "text" })
  log: string;

  toString = () => {
    return JSON.stringify({
      timestamp: this.timestamp,
      type: SSEEventType.DATA,
      log: this.log,
    });
  };
}
