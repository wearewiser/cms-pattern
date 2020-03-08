import { ReadonlyRepository } from './readonly-repository';

/**
 * SinglePageRepository
 *
 * A subset of ReadonlyRepository<T, S> omiting list.
 *
 * Data of type T can be accessed
 * by id of type S.
 */
export interface SinglePageRepository<T, S> extends Omit<ReadonlyRepository<T, S>, 'list'> { }
