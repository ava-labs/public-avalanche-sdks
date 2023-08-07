export type CreateParserConfig = (rpcUrl: string) => ParserConfig;

export type ParserConfig = {
  getTransactionDetails: (txId: string) => Promise<TransactionDetails>;
};

type TransactionDetails = {
  txId: string;
  blockHash: string;
};
