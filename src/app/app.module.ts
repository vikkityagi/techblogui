import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BlogListComponent } from './blog-list/blog-list.component';
import { BlogFormComponent } from './blog-form/blog-form.component';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule for HTTP requests
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component'; // Import FormsModule and ReactiveFormsModule for form handling
import { MatToolbarModule } from '@angular/material/toolbar';
import { UserHistoryComponent } from './user-history/user-history.component'; // Import MatToolbarModule for the navbar
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { MatDatepickerModule } from '@angular/material/datepicker'; // Import MatDatePickerModule for date selection
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AboutComponent } from './about/about.component';
import { BlogDialogComponent } from './blog-dialog/blog-dialog.component'; // Import MatTooltipModule for tooltips
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    BlogListComponent,
    BlogFormComponent,
    LoginComponent,
    NavbarComponent,
    UserHistoryComponent,
    SignupComponent,
    HomeComponent,
    AboutComponent,
    BlogDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule, // Import HttpClientModule for HTTP requests
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    FormsModule,
    MatToolbarModule, // Import MatToolbarModule for the navbar
    MatIconModule,
    MatAutocompleteModule,
    MatDatepickerModule, // Import MatDatepickerModule for date selection
    MatNativeDateModule, // Import MatNativeDateModule for native date support
    MatTooltipModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
