import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CourseService } from '../../services/course';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  portalName: string = 'Student Course Portal';
  isPortalActive: boolean = true;
  message: string = '';
  searchTerm: string = '';
  availableCoursesCount: number = 0;

  constructor(private courseService: CourseService, private router: Router) {}

  ngOnInit(): void {
    console.log('HomeComponent initialised - loading courses count');
    this.courseService.getCourses().subscribe({
      next: (courses) => {
        this.availableCoursesCount = courses.length;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  ngOnDestroy(): void {}

  onEnrollClick(): void {
    this.message = 'Enrollment opened!';
  }

  onSearchTrigger(): void {
    if (this.searchTerm) {
      this.router.navigate(['/courses'], { queryParams: { search: this.searchTerm } });
    }
  }
}