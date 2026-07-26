import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn: boolean = true;

  checkLogin(): boolean {
    return this.isLoggedIn;
  }
}