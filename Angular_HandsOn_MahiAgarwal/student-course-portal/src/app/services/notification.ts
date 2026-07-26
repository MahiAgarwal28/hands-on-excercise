import { Injectable } from '@angular/core';

@Injectable()
export class NotificationService {
  private logId: number = Math.random();

  getLogId(): number {
    return this.logId;
  }
}
