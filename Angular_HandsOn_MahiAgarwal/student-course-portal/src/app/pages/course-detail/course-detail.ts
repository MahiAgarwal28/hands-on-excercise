import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CourseService } from '../../services/course';
import { Course } from '../../models/course';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './course-detail.html',
  styleUrl: './course-detail.css'
})
export class CourseDetailComponent implements OnInit {
  course: Course | undefined;
  students: any[] = [];
  errorMessage: string = '';

  constructor(private route: ActivatedRoute, private courseService: CourseService) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.courseService.getEnrolledStudentsWithCourse(+idParam).subscribe({
        next: (data) => {
          this.course = data.course;
          this.students = data.students;
        },
        error: (err) => {
          this.errorMessage = 'Failed to load details.';
          console.error(err);
        }
      });
    }
  }
}