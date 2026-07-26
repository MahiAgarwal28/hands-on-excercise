import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { StudentProfileComponent } from './pages/student-profile/student-profile';
import { CoursesLayoutComponent } from './pages/courses-layout/courses-layout';
import { CourseListComponent } from './pages/course-list/course-list';
import { CourseDetailComponent } from './pages/course-detail/course-detail';
import { NotFoundComponent } from './pages/not-found/not-found';
import { authGuard } from './guards/auth';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'profile', component: StudentProfileComponent, canActivate: [authGuard] },
  {
    path: 'courses',
    component: CoursesLayoutComponent,
    children: [
      { path: '', component: CourseListComponent },
      { path: ':id', component: CourseDetailComponent }
    ]
  },
  {
    path: 'enroll',
    loadChildren: () => import('./features/enrollment/enrollment.route').then(m => m.ENROLLMENT_ROUTES)
  },
  { path: '**', component: NotFoundComponent }
];