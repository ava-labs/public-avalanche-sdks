export enum ErrorCode {
  NOT_IMPLEMENTED = 5001,
}

class BridgeError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
  ) {
    super(message);
    this.code = code;
  }
}

export class NotImplementedError extends BridgeError {
  constructor(message = 'Not implemented') {
    super(message, ErrorCode.NOT_IMPLEMENTED);
    this.name = 'NotImplementedError';
  }
}
