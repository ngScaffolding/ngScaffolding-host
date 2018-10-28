import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NgscaffoldingCoreService {

  constructor() { }

  public whatSayYou(): string {
    return 'Im Here!';
  }
}
