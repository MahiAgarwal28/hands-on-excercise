import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-enrollment-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './enrollment-form.html',
  styleUrl: './enrollment-form.css'
})
export class EnrollmentFormComponent {
  studentName: string = '';
  studentEmail: string = '';
  courseId: number | null = null;
  preferredSemester: string = '';
  agreeToTerms: boolean = false;
  isSubmittedSuccessfully: boolean = false;

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.isSubmittedSuccessfully = true;
    }
  }

  onReset(form: NgForm): void {
    form.resetForm();
    this.isSubmittedSuccessfully = false;
  }
}