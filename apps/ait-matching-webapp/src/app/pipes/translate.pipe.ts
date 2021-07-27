
import { AitTranslationService } from '@ait/ui';
import { Injectable, Pipe, PipeTransform } from '@angular/core';


@Injectable()
@Pipe({
  name: 'aureoleTranslate',
  pure: true
})
export class TranslatePipe implements PipeTransform {

    constructor(private translationService: AitTranslationService) {}

  transform(value: any, args?: any): any {
     return this.translationService.translate(value);
  }

}
