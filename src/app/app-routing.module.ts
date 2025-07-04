import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogFormComponent } from './blog-form/blog-form.component';
import { BlogListComponent } from './blog-list/blog-list.component';
import { LoginComponent } from './login/login.component';
import { UserHistoryComponent } from './user-history/user-history.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent }, // Assuming you have a HomePageComponent
  { path: 'add-blog', component: BlogFormComponent },
  { path: 'login', component: LoginComponent },
  { path: 'history', component: UserHistoryComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'blog-list', component: BlogListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
