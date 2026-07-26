import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CanComponentDeactivate } from '../../guards/unsaved-changes';

@Component({
  selector: 'app-reactive-enrollment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reactive-enrollment-form.html',
  styleUrl: './reactive-enrollment-form.css'
})
export class ReactiveEnrollmentFormComponent implements OnInit, CanComponentDeactivate {
  enrollForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.enrollForm = this.fb.group({
      studentName: ['', [Validators.required, Validators.minLength(3)]],
      studentEmail: ['', [Validators.required, Validators.email], [this.simulateEmailCheck]],
      courseId: ['', [Validators.required, this.noCourseCode]],
      preferredSemester: ['', [Validators.required]],
      agreeToTerms: [false, [Validators.requiredTrue]],
      additionalCourses: this.fb.array([])
    });
  }

  noCourseCode(control: AbstractControl): ValidationErrors | null {
    const value = control.value ? String(control.value) : '';
    if (value.startsWith('XX')) {
      return { noCourseCode: true };
    }
    return null;
  }

  simulateEmailCheck(control: AbstractControl): Promise<ValidationErrors | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const email = control.value ? String(control.value) : '';
        if (email.includes('test@')) {
          resolve({ emailTaken: true });
        } else {
          resolve(null);
        }
      }, 800);
    });
  }

  get additionalCourses(): FormArray {
    return this.enrollForm.get('additionalCourses') as FormArray;
  }

  addCourse(): void {
    this.additionalCourses.push(new FormControl('', Validators.required));
  }

  removeCourse(index: number): void {
    this.additionalCourses.removeAt(index);
  }

  canDeactivate(): boolean {
    if (this.enrollForm.dirty) {
      return window.confirm('You have unsaved changes. Leave?');
    }
    return true;
  }

  onSubmit(): void {
    if (this.enrollForm.valid) {
      console.log('enrollForm.value:', this.enrollForm.value);
      this.enrollForm.markAsPristine();
    }
  }
}
