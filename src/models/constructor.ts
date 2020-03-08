/**
 * Constructor<T>
 *
 * A generic constructor type that
 * takes arbitrary arguments
 */
export type Constructor<T> = new (...args: any[]) => T;
