import type { MaybeArray } from './type-utils';
import type { Simplify } from 'type-fest';

export type CreateParserConfig<T extends PageFetchers> = (rpcUrl: string) => ParserConfig<T>;

export type PageFetchers = {
  transactionDetails?: (txId: string) => Promise<any>;
  addressDetails?: (address: string) => Promise<any>;
};

type DataFetcherFunc = (...args: any[]) => Promise<any>;

export type ParserConfig<T extends PageFetchers> = {
  [K in keyof T]?: T[K] extends DataFetcherFunc ? PageConfig<T[K]> : never;
};

export type PageConfig<TDataFetcherFunc extends DataFetcherFunc> = {
  getPageData: TDataFetcherFunc;
  displayFormat: (data: Awaited<ReturnType<TDataFetcherFunc>>) => PageSection[];
};

export type PageSection = {
  title?: string;
  fields: Field[];
};

export type Field = Simplify<{
  // The name of the field.
  name: string;

  // The tooltip description for the datum.
  description?: string;

  displayInfo: MaybeArray<FieldDisplayValue>;
}>;

export type FieldDisplayInfo<TDataDisplayFormat extends keyof DataDisplayFormatMap> = {
  value: DataDisplayFormatMap[TDataDisplayFormat];
  displayAs: TDataDisplayFormat;
  uriValue?: string;
  uriDestination?: UriDestination;
  textColor?: 'text.primary' /* default */ | 'text.secondary' | 'success' | 'error' | 'warning' | 'info';
};

export type FieldDisplayValue = {
  [K in keyof DataDisplayFormatMap]: Simplify<MaybeArray<FieldDisplayInfo<K>>>;
}[keyof DataDisplayFormatMap];

/**
 * Maps the display format to the type of the value.
 */
export type DataDisplayFormatMap = {
  [DataDisplayAs.AVATAR_IMAGE]: string;
  [DataDisplayAs.CHIP]: number | string | boolean;
  [DataDisplayAs.DATETIME]: string; // UNIX Timestamp
  [DataDisplayAs.DATETIME_RELATIVE]: string; // UNIX Timestamp
  [DataDisplayAs.HASH]: string;
  [DataDisplayAs.JSON]: string;
  [DataDisplayAs.TEXT]: number | string | boolean;
};

/**
 * How the displayValue should be displayed in the UI.
 */
export enum DataDisplayAs {
  /**
   * Displays the value as an image in a circular avatar.
   */
  AVATAR_IMAGE = 'AVATAR_IMAGE',
  /**
   * Displays the value as a string in a chip.
   */
  CHIP = 'CHIP',
  /**
   * Displays the value as a datetime string.
   */
  DATETIME = 'DATETIME',
  /**
   * Displays the value as a unix timestamp.
   */
  DATETIME_RELATIVE = 'DATETIME_RELATIVE', // Displays a unix timestamp as a relative time from now.
  /**
   * Displays the value as a hash (we will dynamically truncate it to fit the screen size).
   */
  HASH = 'HASH',
  /**
   * Displays the string value as JSON.
   */
  JSON = 'JSON',
  /**
   * Displays the string value as plain text.
   */
  TEXT = 'TEXT',
}

/**
 * Various locations which a uriValue will route to.
 */
export enum UriDestination {
  /**
   * Link to the Address page ('/address/:address')
   * Value must be an address.
   */
  ADDRESS_PAGE = '/address/:address',

  /**
   * Link to the Block Details page ('/block/:blockId')
   * Value must be a block ID.
   */
  BLOCK_PAGE = '/block/:blockId',

  /**
   * Link to the Transaction page ('/tx/:txId')
   * Value must be a transaction ID.
   */
  TRANSACTION_PAGE = '/tx/:txId',

  /**
   * Link to the Token page ('token/:contractAddress')
   * Value must be a token address.
   */
  TOKEN_PAGE = 'token/:contractAddress',

  /**
   * Link externally in a new tab.
   * Value must be a full URL.
   */
  EXTERNAL_LINK = 'EXTERNAL_LINK', // This is a special case that will open the link at an external domain.
}
