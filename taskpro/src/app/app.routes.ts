import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

export const routes: Routes = [

    { path: "login", component: LoginComponent },
    { path: "", component: HomeComponent },
    { path: "side", component: SidebarComponent }
];
