/**
 * Repository<T, S>
 *
 * An interface of the Repository
 * Patern. Provides an interface
 * for basic data access.
 *
 * Data of type T can be accessed
 * by id of type S.
 */
export interface Repository<T, S> {

  /**
   * list
   *
   * List an array of data partial instances.
   *
   * @returns An array of data partial instances or throws
   */
  list(): Promise<Partial<T>[]> | never;

  /**
   * read
   *
   * Read a data instance by id.
   *
   * @param id The id of data to find
   * @returns A data instance or throws
   */
  read(id: S): Promise<T> | never;

  /**
   * create
   *
   * Create the provided partial data instance.
   *
   * @param data A partial of data to create
   * @return The saved partial data instance or throws
   */
  create(data: Partial<T>): Promise<T> | never;

  /**
   * update
   *
   * Update the target data by id with
   * provided partial data instance.
   *
   * @param id The id of data to update
   * @param data A partial of data to create
   * @return The updated partial data instance or throws
   */
  update(id: S, data: Partial<T>): Promise<T> | never;

  /**
   * destroy
   *
   * Destroy the data instance matching the id.
   *
   * @param id The id of data to destroy
   * @return The deleted partial data instance or throws
   */
  destroy(id: S): Promise<T> | never;
}
