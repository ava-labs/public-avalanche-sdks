import type { MaybeArray } from './type-utils.js';

export type CreateParserConfig<T extends PageFetchers> = (rpcUrl: string) => ParserConfig<T>;

export type PageFetchers = {
  transactionDetails?: (txId: string) => Promise<any>;
  addressDetails?: (address: string) => Promise<any>;
};

type DataFetcherFunc = (...args: any[]) => Promise<any>;

export type ParserConfig<T extends PageFetchers> = {
  [K in keyof T]?: T[K] extends DataFetcherFunc ? PageConfig<T[K]> : never;
};

type PageConfig<TDataFetcherFunc extends DataFetcherFunc> = {
  getPageData: TDataFetcherFunc;
  displayFormat: (data: Awaited<ReturnType<TDataFetcherFunc>>) => CardSection[];
};

export type CardSection = {
  cardtitle?: string;
  fields: Field[];
};

export type Field = {
  // The name of the field.
  name: string;

  // The tooltip description for the datum.
  description?: string;

  // The value to be displayed in the explorer.
  displayValue: MaybeArray<string | number | boolean>;

  // The value that will be used to link to another page in the explorer
  uriValue: string | number;

  // The page that the link will point to. If not provided, the value won't link anywhere.
  uriDestination: UriDestination;
};

export enum UriDestination {
  ADDRESS = 'address',
  BLOCK_HASH = 'block-hash',
  BLOCK_NUMBER = 'block-number',
  TRANSACTION_HASH = 'transaction-hash',
}

export enum DataDisplayType {
  HASH = 'hash',
  NUMBER = 'number',
  STRING = 'string',
  BOOLEAN = 'boolean',
  SUCCESS_FAILURE = 'success-failure',
  DATETIME = 'datetime',
  RELATIVE_DATETIME = 'relative-datetime',
}
