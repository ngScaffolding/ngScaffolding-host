import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'buttonColor' })
export class ButtonColorPipe implements PipeTransform {
  transform(inputColor: string): string {
    let returnColor: string;
    switch (inputColor) {
      case 'blue': {
        returnColor = 'blue-grey-btn';
        break;
      }
      case 'cyan': {
        returnColor = 'cyan-btn';
        break;
      }
      case 'amber': {
        returnColor = 'amber-btn';
        break;
      }
      case 'teal': {
        returnColor = 'teal-btn';
        break;
      }
      case 'red': {
        returnColor = 'red-btn';
        break;
      }
      case 'orange': {
        returnColor = 'orange-btn';
        break;
      }
      case 'blue': {
        returnColor = 'blue-btn';
        break;
      }
      case 'green': {
        returnColor = 'green-btn';
        break;
      }
      case 'deep': {
        returnColor = 'deep-orange-btn';
        break;
      }
      case 'purple': {
        returnColor = 'purple-btn';
        break;
      }
      case 'indigo': {
        returnColor = 'indigo-btn';
        break;
      }
      case 'pink': {
        returnColor = 'pink-btn';
        break;
      }
      default:
        {
          returnColor = 'blue-grey-btn';
        }

        return returnColor;
    }
  }
}
