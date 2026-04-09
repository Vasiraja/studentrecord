import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TableviewComponent } from './components/tableview/tableview.component';
import { EditComponent } from './components/edit/edit.component';

export const routes: Routes = [

    { path: "login", component: LoginComponent },
    { path: "", component: HomeComponent },
    { path: "table", component: TableviewComponent },
    { path: "edit", component: EditComponent },
];
