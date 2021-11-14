import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'idConverter',
})
export class IdConverterPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    if (typeof value !== 'undefined') {
      return btoa(value + '')
    }

    return null
  }
}
