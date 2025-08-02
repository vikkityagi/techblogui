import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogFormComponent } from './blog-form/blog-form.component';
import { BlogListComponent } from './blog-list/blog-list.component';
import { LoginComponent } from './login/login.component';
import { UserHistoryComponent } from './user-history/user-history.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './auth.guard';
import { AboutComponent } from './about/about.component';
import { AddCategoryComponent } from './add-category/add-category.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'add-blog', component: BlogFormComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'history', component: UserHistoryComponent, canActivate: [authGuard] },
  { path: 'blog-list', component: BlogListComponent, canActivate: [authGuard] },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'add-category', component: AddCategoryComponent, canActivate: [authGuard] },
  { path: 'blog-list/:id/:title', component: BlogListComponent, canActivate: [authGuard] } // Assuming you have a BlogDetailComponent for viewing individual blogs

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
