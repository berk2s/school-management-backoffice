export interface Pagination {
  length: number
  size: number
  page: number
  sortedBy: string
  order: SortDirection
}

export interface Page<T> {
  content: T[]
  pageable: {
    sort: {
      sorted: boolean
      unsorted: boolean
      empty: boolean
    }
    offset: number
    pageNumber: number
    pageSize: number
    paged: boolean
    unpaged: boolean
  }
  last: boolean
  first: boolean
  totalElements: number
  totalPages: number
  numberOfElements: number
  size: number
  empty: boolean
  number: number
  sort: {
    sorted: boolean
    unsorted: boolean
    empty: boolean
  }
}

export type SortDirection = 'asc' | 'desc'
