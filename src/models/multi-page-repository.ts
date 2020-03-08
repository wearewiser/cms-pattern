import { ReadonlyRepository } from './readonly-repository';

/**
 * MultiPageRepository
 *
 * A mirror of ReadonlyRepository<T, S>.
 *
 * Data of type T can be accessed
 * by id of type S.
 */
export interface MultiPageRepository<T, S> extends ReadonlyRepository<T, S> { }
