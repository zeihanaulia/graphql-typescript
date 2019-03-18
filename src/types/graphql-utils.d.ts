import { Redis } from "ioredis";
import { url } from "inspector";

export interface ResolverMap {
  [key: string]: {
    [key: string]: (
      parent: any,
      args: any,
      context: {
        redis: Redis;
        url: string;
        session: Session;
      },
      info: any
    ) => any;
  };
}

export interface Session {
  userId?: string
}