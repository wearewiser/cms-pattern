/**
 * CmsPageFilter<T>
 *
 * A filter to be applied on an instance of type T,
 * where a key of T is provided and value of unknown
 * type must be matched.
 */
export type CmsPageFilter<T> = { key: keyof T, value: unknown };
