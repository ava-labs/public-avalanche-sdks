import type { MaybeArray } from './type-utils';

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
  sectionTitle?: string;
  fields: Field[];
};

export type Field = {
  // The name of the field.
  name: string;

  // The tooltip description for the datum.
  description?: string;

  // The value to be displayed in the explorer.
  displayValue: MaybeArray<string | number | boolean>;

  // The format in which displayValue will be displayed.
  displayFormat: DataDisplayFormat;

  // The value that will be used to link to another page in the explorer
  uriValue?: string | number;

  // The route or external link that the value will route to when clicked.
  uriDestination?: UriDestination;
};

/**
 * Various locations which a uriValue will route to.
 */
export enum UriDestination {
  ADDRESS = '/address/:address',
  BLOCK_HASH = '/block/:blockHash',
  BLOCK_NUMBER = '/block/:blockNumber',
  TRANSACTION_HASH = '/tx/:txHash',
  TOKEN_ADDRESS = 'token/:tokenAddress',
  EXTERNAL_LINK = 'EXTERNAL_LINK', // This is a special case that will open the link at an external domain.
}

/**
 * How the displayValue should be displayed in the UI.
 */
export enum DataDisplayFormat {
  HASH = 'HASH', // Displays as a hash which truncates depending on the screen size.
  NUMBER = 'NUMBER',
  STRING = 'STRING',
  BOOLEAN = 'BOOLEAN',
  BOOLEAN_SUCCESS_FAILURE = 'BOOLEAN_SUCCESS_FAILURE',
  DATETIME = 'DATETIME', // Displays a unix timestamp full date and time
  RELATIVE_DATETIME = 'RELATIVE_DATETIME', // Displays a unix timestamp as a relative time from now.
  JSON = 'JSON', // Displays a JSON object as a string.
  STRING_CHIP = 'STRING_CHIP', // Displays the string as a chip.
}
