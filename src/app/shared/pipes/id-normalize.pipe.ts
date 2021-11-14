import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'idNormalize',
})
export class IdNormalizePipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    if (typeof value !== 'undefined') {
      try {
        return atob(value + '')
      } catch (err) {
        return null
      }
    }

    return null
  }
}
