import { HttpParams } from '@angular/common/http'
import { SortDirection } from '@angular/material/sort'

export const generateSearchParams = (
  page: number,
  size: number,
  sort: string,
  order: SortDirection,
  search: string,
): HttpParams => {
  let params = new HttpParams()
  params = params.set('page', page)
  params = params.set('size', size)
  params = params.set('sort', sort)
  params = params.set('order', order)
  params = params.set('search', search)

  return params
}
