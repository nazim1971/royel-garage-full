import { BaseQueryApi } from '@reduxjs/toolkit/query/react';

export type TError = {
  data: {
    message: string;
    stake: string;
    success: boolean;
  };
  status: number;
};

export type TMeta = {
  limit?: number;
  page?: number;
  total?: number;
  totalPage?: number;
};

export type TResponse<T> = {
  data?: {
    result?: T;         // Use result here to wrap the actual data array
    meta?: TMeta;       // Optional meta property
  };
  message?: string;
  success?: boolean;
  meta?: TMeta;
  error?: TError;
};

export type TResponseRedux<T> = TResponse<T> & BaseQueryApi;

export type TQueryParam = {
  name: string;
  value: boolean | React.Key;
};