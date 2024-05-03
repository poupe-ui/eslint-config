export type {
  TypedFlatConfig,
} from 'eslint-config-unjs';

export type PropType<T, K extends keyof T> = T[K];
