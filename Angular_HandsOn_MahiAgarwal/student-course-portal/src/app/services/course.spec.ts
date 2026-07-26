import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CourseService } from './course';

describe('CourseService', () => {
  let service: CourseService;
  let httpMock: HttpTestingController;

  const mockCourses = [
    { id: 101, name: 'Angular Basics (API)', code: 'ANG-101', credits: 4, gradeStatus: 'passed' },
    { id: 102, name: 'Advanced TypeScript (API)', code: 'TS-201', credits: 3, gradeStatus: 'pending' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CourseService]
    });
    service = TestBed.inject(CourseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all courses via getCourses()', () => {
    service.getCourses().subscribe(courses => {
      expect(courses.length).toBe(2);
      expect(courses).toEqual(mockCourses);
    });

    const req = httpMock.expectOne('http://localhost:3000/courses');
    expect(req.request.method).toBe('GET');
    req.flush(mockCourses);
  });

  it('should catch error message when getCourses() returns a 500 error status code', () => {
    service.getCourses().subscribe({
      next: () => fail('Expected server operation to fail with 500 status code handler error'),
      error: (error) => {
        expect(error.message).toBe('Failed to load courses. Please try again.');
      }
    });

    const req = httpMock.expectOne('http://localhost:3000/courses');
    req.flush('Internal Server Error status callback testing operation failed', { status: 500, statusText: 'Server Error' });
  });
});
