// types.ts
export type CacheStrategy =
  | {
      ttl: number;
      swr: number;
    }
  | {
      ttl: number;
    }
  | {
      swr: number;
    };
