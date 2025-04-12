class SearchRequestDTO {
  constructor(page, size, sortDirection, sortBy, filter) {
    this.page = page;
    this.size = size;
    this.sortDirection = sortDirection;
    this.sortBy = sortBy;
    this.filter = filter;
  }
}

export default SearchRequestDTO;
