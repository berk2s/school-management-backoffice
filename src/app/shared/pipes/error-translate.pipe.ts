import { Pipe, PipeTransform } from '@angular/core'
import { translateMessage } from 'src/app/helper/error-response.helper'

@Pipe({
  name: 'errorTranslate',
})
export class ErrorTranslatePipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    return translateMessage(parseInt(value))
  }
}
