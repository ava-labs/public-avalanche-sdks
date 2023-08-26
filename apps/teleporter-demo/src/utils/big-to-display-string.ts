import { formatters } from '@poppinss/intl-formatter';

export const bigToDisplayString = (bigNum?: Big, options?: Intl.NumberFormatOptions): string =>
  bigNum ? formatters.number('en-US', options).format(bigNum.toString() as unknown as number) : '';
