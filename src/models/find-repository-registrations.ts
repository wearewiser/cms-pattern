import { ReadonlyRepository } from './readonly-repository';
import { RepositoryRegistration } from './repository-registration';
import { Constructor } from './constructor';

/**
 * findRepositoryRegistrations
 *
 * Finds all Repository instances registered to
 * a page Constructor in the provided registrations
 * argument.
 *
 * @param registrations An array of registrations to search for a matching Repository for a Page
 * @param registration A reference to the target RepositoryRegistration class
 * @param Page The Constructor that should be registered the target Repository
 */
export function findRepositoryRegistrations<T, S, U extends ReadonlyRepository<T, S>>(
  registrations: RepositoryRegistration<T, S>[],
  Registration: Constructor<RepositoryRegistration<U, S>>,
  Page: Constructor<T>,
): Constructor<U>[] {
  const matches: RepositoryRegistration<T, S>[] =
    registrations.filter(
      (registration: RepositoryRegistration<T, S>) =>
        registration instanceof Registration &&
        registration.Data === Page,
    );
  if (matches.length < 1) {
    throw new Error(`No repository registered for page ${Page.name} in the ${Registration.name} set of registrations`);
  }
  return matches.map(
    ({ Repository }) => Repository as Constructor<U>,
  );
}
