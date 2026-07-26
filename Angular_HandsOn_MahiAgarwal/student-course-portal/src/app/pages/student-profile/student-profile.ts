import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnrollmentService } from '../../services/enrollment';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-profile.html',
  styleUrl: './student-profile.css'
})
export class StudentProfileComponent implements OnInit {
  enrolledCourses: any[] = [];

  constructor(private enrollmentService: EnrollmentService) {}

  ngOnInit(): void {
    this.refreshProfile();
  }

  refreshProfile(): void {
    this.enrollmentService.getEnrolledCourses().subscribe({
      next: (data) => {
        this.enrolledCourses = data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}