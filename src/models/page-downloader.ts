import { Resolve } from 'tsnode-di';
import { CmsState } from './cms-state';
import { Constructor } from './constructor';
import { SinglePageRepository } from './single-page-repository';
import { findRepositoryRegistrations } from './find-repository-registrations';
import { SinglePageRepositoryRegistration } from './single-page-repository-registration';
import { MultiPageRepository } from './multi-page-repository';
import { MultiPageRepositoryRegistration } from './multi-page-repository-registration';

/**
 * PageDownloader<T extends Object, S>
 *
 * Allows extending class to register page repositories,
 * and then exposes methods for downloading page data of
 * type T from the assigned Repository instances matching
 * on id of type S as defined in the Repository implementation.
 */
export abstract class PageDownloader<T extends Object, S> {

  /**
   * single_page_repository_registrations
   *
   * An array that holds MultiPageRepositoryRegistration<T, S>.
   * This must be implemented by the child class.
   */
  protected abstract readonly registrations:
    (SinglePageRepositoryRegistration<T, S> | MultiPageRepositoryRegistration<T, S>)[];

  /**
   * factory
   *
   * A function that instantiates a class constructor reference.
   * Might be required by implementing classes to access dependency
   * injection.
   */
  protected factory: <T>(Obj: Constructor<T>) => T = Obj => new Obj();

  // Dependency injection of state
  @Resolve(CmsState)
  private state!: CmsState<T>;

  /**
   * downloadPage
   *
   * Downloads a page that is an instance matching the
   * Page parameter and matching on id from the fastest
   * responding SinglePageRepositoryRegistration that
   * was registered to the Constructor matching the
   * Page argument in single_page_repository_registrations.
   *
   * The promise resolves when the the first
   * Repository.read either returns or throws.
   *
   * @param Page A constructor referenec for the target page type
   * @param id The id of the target page
   */
  public downloadPage(Page: Constructor<T>, id: S): Promise<void> {
    return new Promise<void>(
      async (resolve, reject) => {
        try {
          const Repositories: Constructor<SinglePageRepository<T, S>>[] =
            findRepositoryRegistrations(
              this.registrations,
              SinglePageRepositoryRegistration,
              Page,
            );
          const repositories = Repositories.map(
            Repository => this.factory(Repository),
          );
          const page: T = await Promise.race(
            repositories.map(
              repository => repository.read(id),
            ),
          );
          this.state.data.next(page);
          resolve();
        } catch (e) {
          reject(e);
        }
      },
    );
  }

  /**
   * downloadPages
   *
   * Downloads the page partials that are an instance
   * matching the Page parameter from the fastest
   * responding MultiPageRepositoryRegistration that
   * was registered to the Constructor matching the
   * Page argument in multi_page_repository_registrations.
   *
   * The promise resolves when the the first
   * Repository.list either returns or throws.
   *
   * @param Page A constructor referenec for the target page type
   * @param id The id of the target page
   */
  public downloadPages(Page: Constructor<T>): Promise<void> {
    return new Promise<void>(
      async (resolve, reject) => {
        try {
          const Repositories: Constructor<MultiPageRepository<T, S>>[] =
            findRepositoryRegistrations(
              this.registrations,
              MultiPageRepositoryRegistration,
              Page,
            );
          const repositories = Repositories.map(
            Repository => this.factory(Repository),
          );
          const pages: Partial<T>[] = await Promise.race(
            repositories.map(
              repository => repository.list(),
            ),
          );
          this.state.data.next(pages);
          resolve();
        } catch (e) {
          reject(e);
        }
      },
    );
  }

}
