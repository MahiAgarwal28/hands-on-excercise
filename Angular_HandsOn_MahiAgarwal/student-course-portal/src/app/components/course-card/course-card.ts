import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighlightDirective } from '../../directives/highlight';
import { CreditLabelPipe } from '../../pipes/credit-label-pipe';
import { EnrollmentService } from '../../services/enrollment';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule, HighlightDirective, CreditLabelPipe],
  templateUrl: './course-card.html',
  styleUrl: './course-card.css'
})
export class CourseCardComponent implements OnChanges {
  @Input() course!: { id: number; name: string; code: string; credits: number; gradeStatus: 'passed' | 'failed' | 'pending' };
  @Output() enrollRequested = new EventEmitter<number>();

  isExpanded: boolean = false;

  constructor(private enrollmentService: EnrollmentService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['course']) {
      console.log('Course changed:', {
        previous: changes['course'].previousValue,
        current: changes['course'].currentValue
      });
    }
  }

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
  }

  handleEnrollToggle(): void {
    if (this.isCurrentlyEnrolled) {
      this.enrollmentService.unenroll(this.course.id);
    } else {
      this.enrollmentService.enroll(this.course.id);
      this.enrollRequested.emit(this.course.id);
    }
  }

  get isCurrentlyEnrolled(): boolean {
    return this.enrollmentService.isEnrolled(this.course.id);
  }

  get cardClasses() {
    return {
      'card--enrolled': this.isCurrentlyEnrolled,
      'card--full': this.course.credits >= 4,
      'expanded': this.isExpanded
    };
  }

  get borderStyle() {
    switch (this.course.gradeStatus) {
      case 'passed':
        return '5px solid green';
      case 'failed':
        return '5px solid red';
      case 'pending':
        return '5px solid grey';
      default:
        return '1px solid #ddd';
    }
  }
}
