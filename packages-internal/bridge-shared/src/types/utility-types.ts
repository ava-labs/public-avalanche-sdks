export type MaybePromise<T> = T | Promise<T>;

export type Reassign<T extends Record<string, unknown>, U extends Partial<Record<keyof T, unknown>>> = {
  [K in keyof T]: K extends keyof U ? U[K] : T[K];
};
