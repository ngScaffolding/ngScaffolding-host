import { Injectable, Type } from '@angular/core';
import { Route, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class DynamicComponentService {
  private compRoutes: Route[] = [];
  constructor() {}

  public registerComponent(route: Route) {

    // Save for later adding to children
    this.compRoutes.push(route);
  }

  public getComponents(): Route[] {
    const copyArr = this.compRoutes.slice();

    this.compRoutes = [];
    return copyArr;
  }
}
