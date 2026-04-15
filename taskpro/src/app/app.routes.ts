import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TableviewComponent } from './components/tableview/tableview.component';
import { EditComponent } from './components/edit/edit.component';
import { protectGuard } from './protect.guard';
import { AddComponent } from './components/add/add.component';

export const routes: Routes = [

    { path: "login", component: LoginComponent },
    // { path: "table", component: TableviewComponent },
    // { path: "edit", component: EditComponent },
    { path: "", component: HomeComponent, canActivate: [protectGuard] },
    // { path: "add", component: AddComponent },
    { path: "**", component: LoginComponent }
];
