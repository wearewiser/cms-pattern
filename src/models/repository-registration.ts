import { Constructor } from './constructor';
import { Repository } from './repository';

/**
 * RepositoryRegistration<T, S>
 *
 * An interface that maps a generic Constructor
 * to a Repository partial constructor.
 */
export interface RepositoryRegistration<T, S> {
  Data: Constructor<T>;
  Repository: Constructor<Partial<Repository<T, S>>>;
}
