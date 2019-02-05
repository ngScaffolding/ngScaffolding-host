import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserListComponent } from './pages/userList/userList.component';
import { AuthoriseRoleGuard } from 'ngscaffolding-core';

const routes: Routes = [
  { path: 'users', component: UserListComponent, canActivate: [AuthoriseRoleGuard] },
  { path: 'users/test', component: UserListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserAdminRoutingModule { }
