import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserListComponent } from './pages/userList/userList.component';
import { AuthoriseRoleGuard } from 'ngscaffolding-core';
import { UserDetailsComponent } from './pages/userDetails/userDetails.component';

const routes: Routes = [
  { path: 'users', component: UserListComponent, canActivate: [AuthoriseRoleGuard] },
  { path: 'userdetails', component: UserDetailsComponent, canActivate: [AuthoriseRoleGuard] },
  { path: 'users/test', component: UserListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserAdminRoutingModule { }
