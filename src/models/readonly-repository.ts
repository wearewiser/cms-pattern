import { Repository } from './repository';

/**
 * ReadonlyRepository
 *
 * A subset of the Repository interface.
 * Provides readonly acces to data.
 */
export interface ReadonlyRepository<T, S> extends Pick<Repository<T, S>, 'list' | 'read'> { }
