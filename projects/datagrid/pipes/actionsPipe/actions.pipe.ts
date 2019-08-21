import { Pipe, PipeTransform } from '@angular/core';
import { Action } from 'ngscaffolding-models';

@Pipe({
    name: 'actions'
    // ,    pure: false
})
export class ActionsPipe implements PipeTransform {
    transform(items: Action[], isColumn: boolean): any {
        if (!items) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        if (isColumn) {
          return items.filter(item => item.columnButton);
        } else {
          return items.filter(item => !item.columnButton);
        }
    }
}
