import { RepositoryRegistration } from './repository-registration';
import { Constructor } from './constructor';
import { SinglePageRepository } from './single-page-repository';

/**
 * SinglePageRepositoryRegistration<T, S>
 *
 * An implementation of RepositoryRegistration<T, S>
 * that requires the generic constructor Data map to a
 * the Repository of type SinglePageRepository<T, S>.
 */
export class SinglePageRepositoryRegistration<T, S> implements RepositoryRegistration<T, S> {
  constructor(
    public readonly Data: Constructor<T>,
    public readonly Repository: Constructor<SinglePageRepository<T, S>>,
  ) { }
}
