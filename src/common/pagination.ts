export class Pagination<PaginationObject> {
  constructor(
    /**
     * a list of items to be returned
     */
    public readonly items: PaginationObject[],
    public readonly total: number // public readonly links: IPaginationLinks,
  ) /**
   * associated links
   */ {}
}
