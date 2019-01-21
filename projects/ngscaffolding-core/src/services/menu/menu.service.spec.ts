import { MenuService } from './menu.service';
import { UserAuthenticationBase } from '../userAuthorisation/UserAuthenticationBase';
import { TestBed, inject } from '@angular/core/testing';
import { RolesService } from '../rolesService/roles.service';

describe('MenuService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MenuService,
        RolesService,
        {
          provide: UserAuthenticationBase,
          useValue: { currentUser: { roles: ['users', 'admin'] } }
        }
      ]
    });
  });

  it(
    'User NOT in user group When no Groups Defined',
    inject([RolesService], (rolesService: RolesService) => {
      rolesService.authQuery.currentUser.roles = [];
      expect(rolesService.isInRole('users')).toEqual(false);
    })
  );


});
