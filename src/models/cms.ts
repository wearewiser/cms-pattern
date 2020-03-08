import { Resolve } from 'tsnode-di';
import { Observable } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import { CmsState } from './cms-state';
import { Constructor } from './constructor';
import { CmsPageFilter } from './cms-filter';

/**
 * CMS<T extends Object>
 */
export class CMS<T extends Object> {

  // Dependency injection of state
  @Resolve(CmsState)
  private state!: CmsState<T>;

  /**
   * streamPage
   *
   * Stream pages that are an instance of the provided
   * Page argument. Optionally filter with the
   * page_filter argument.
   *
   * @param Page The Constructor of the target page
   * @param page_filter An optional filter
   */
  public streamPage<U extends T>(Page: Constructor<U>, page_filter?: CmsPageFilter<U>):
    Observable<U> {
    const { key, value } = page_filter ? page_filter : { key: undefined, value: undefined };
    return this.state.data.asObservable().pipe(
      filter(page => page instanceof Page),
      filter(page => key ? (<U>page)[key as keyof U] === value : true),
    ) as Observable<U>;
  }

  /**
   * streamPages
   *
   * Stream an array of pages that are an instance
   * of the provided Page argument.
   *
   * @param Page The Constructor of the target page
   * @param page_filter An optional filter
   */
  public streamPages<U extends T>(Page: Constructor<U>): Observable<Partial<U>> {
    return this.state.data.asObservable().pipe(
      filter(pages => pages instanceof Array && pages.reduce(
        (a: boolean, b: Partial<T>) => a && b instanceof Page, true,
      )),
    ) as Observable<U>;
  }

  /**
   * page
   *
   * Observe the first page that is an instance of
   * the provided Page argument. Optionally filter
   * with the page_filter argument.
   *
   * @param Page The Constructor of the target page
   * @param page_filter An optional filter
   */
  public page<U extends T>(Page: Constructor<U>, page_filter?: CmsPageFilter<U>):
    Observable<U> {
    return this.streamPage(Page, page_filter).pipe(first());
  }

  /**
   * pages
   *
   * Observe the first array of page that are an
   * instance of the provided Page argument.
   *
   * @param Page The Constructor of the target page
   * @param page_filter An optional filter
   */
  public pages<U extends T>(Page: Constructor<U>): Observable<Partial<U>> {
    return this.streamPages(Page).pipe(first());
  }
}
