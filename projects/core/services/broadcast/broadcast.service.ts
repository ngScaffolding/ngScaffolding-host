import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { map, filter } from 'rxjs/operators';

interface BroadcastEvent {
  key: any;
  data?: any;
}

export const enum BroadcastTypes {
  SHOW_MESSAGE = 'SHOW_MESSAGE',

  SHOW_SPINNER = 'SHOW_SPINNER',
  HIDE_SPINNER = 'HIDE_SPINNER',
  CLOSE_POPUP = 'CLOSE_POPUP'
}

@Injectable({
  providedIn: 'root',
})
export class BroadcastService {
  private _eventBus: Subject<BroadcastEvent>;

  constructor() {
    this._eventBus = new Subject<BroadcastEvent>();
  }

  broadcast(key: any, data?: any) {
    this._eventBus.next({ key, data });
  }

  on<T>(key: any): Observable<T> {
    return this._eventBus.pipe(
        filter(event => event.key === key),
        map(event => <T>event.data)
    );
  }
}
