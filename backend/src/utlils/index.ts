import * as bcrypt from 'bcrypt';
import { ColumnOptions } from 'typeorm';

export const getPasswordHash = (password: string) => {
  return bcrypt.hash(password, 10);
};

export const currencyDescriptor: ColumnOptions = {
  type: 'numeric',
  precision: 10,
  scale: 2,
  default: 0,
  transformer: {
    to: (data: number) => data,
    from: (data: string) => parseFloat(data),
  },
};
