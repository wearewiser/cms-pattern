import { ReplaySubject } from 'rxjs';

/**
 * CmsState<T extends Object>
 *
 * An instantiable encapulation of a ReplaySubject
 * that handles instances of T or arrays of T partials.
 */
export class CmsState<T extends Object> {
  public data = new ReplaySubject<T | Partial<T>[]>();
}
