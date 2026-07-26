import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { CourseListComponent } from './course-list';

describe('CourseListComponent (NgRx Store Connection)', () => {
  let component: CourseListComponent;
  let fixture: ComponentFixture<CourseListComponent>;
  let store: MockStore;

  const initialState = {
    course: {
      courses: [
        { id: 101, name: 'Angular Basics (API)', code: 'ANG-101', credits: 4, gradeStatus: 'passed' },
        { id: 102, name: 'Advanced TypeScript (API)', code: 'TS-201', credits: 3, gradeStatus: 'pending' }
  ],
      loading: false,
      error: null
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseListComponent],
      providers: [provideMockStore({ initialState })]
    }).compileComponents();

    fixture = TestBed.createComponent(CourseListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
  });

  it('should render exact initial course card listings from state management registry slice', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const cards = compiled.querySelectorAll('app-course-card');
    expect(cards.length).toBe(2);
  });

  it('should show global loading visual indicator text message wrapper when loading selector flag resolves true', () => {
    store.setState({
      course: {
        courses: [],
        loading: true,
        error: null
      }
    });

    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('p')).nativeElement;
    expect(element.textContent).toContain('Loading store courses...');
  });
});
