import { RepositoryRegistration } from './repository-registration';
import { Constructor } from './constructor';
import { MultiPageRepository } from './multi-page-repository';

/**
 * MultiPageRepositoryRegistration<T, S>
 *
 * An implementation of RepositoryRegistration<T, S>
 * that requires the generic constructor Data map to a
 * the Repository of type MultiPageRepository<T, S>.
 */
export class MultiPageRepositoryRegistration<T, S> implements RepositoryRegistration<T, S> {
  constructor(
    public readonly Data: Constructor<T>,
    public readonly Repository: Constructor<MultiPageRepository<T, S>>,
  ) { }
}
