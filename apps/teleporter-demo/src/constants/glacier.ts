import { Glacier } from '@internal/glacier';
import { GLACIER_API_URL } from './urls';

export const glacierService = new Glacier({
  BASE: GLACIER_API_URL,
});
