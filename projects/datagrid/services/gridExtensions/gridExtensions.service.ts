import { Injectable, Type } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GridExtensionsService {
  public readonly valueFormatters: { name: string; formatter: (data: any) => string }[] = [];
  public readonly cellRenderers: { name: string; renderer: Type<any> }[] = [];

  public getValueFormatter(name: string): (data: any) => string {
    const format = this.valueFormatters.find(form => form.name === name);
    if (format) {
      return format.formatter;
    }
    return undefined;
  }

  public getCellRenderer(name: string): Type<any> {
    const foundRenderer = this.cellRenderers.find(form => form.name === name);
    if (foundRenderer) {
      return foundRenderer.renderer;
    }
    return undefined;
  }

  public addValueFormatter(name: string, formatter: (data: any) => string) {
    const format = this.valueFormatters.find(form => form.name === name);
    if (format) {
      format.formatter = formatter;
    } else {
      this.valueFormatters.push({ name, formatter });
    }
  }

  public addCellRenderer(name: string, renderer: Type<any>) {
    const foundRenderer = this.cellRenderers.find(form => form.name === name);
    if (foundRenderer) {
      foundRenderer.renderer = renderer;
    } else {
      this.cellRenderers.push({ name, renderer });
    }
  }
}
