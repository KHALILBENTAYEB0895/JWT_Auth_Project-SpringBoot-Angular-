import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AuthGuard } from './helpers/auth.guard';

const routes: Routes = [
  {path:'register', component:RegisterComponent},
  {path:'login', component:LoginComponent},
  {path:'user', component:UserDashboardComponent, canActivate:[AuthGuard], data:{role:'USER'}},
  {path:'admin', component:AdminDashboardComponent, canActivate:[AuthGuard], data:{role:'ADMIN'}},
  {path:'', redirectTo:'/login',pathMatch: 'full'},
  {path:'**', redirectTo: '/login',pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
