import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  providers: [NotificationService],
  templateUrl: './notification.html',
  styleUrl: './notification.css'
})
export class NotificationComponent implements OnInit {
  instanceId!: number;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.instanceId = this.notificationService.getLogId();
  }
}
