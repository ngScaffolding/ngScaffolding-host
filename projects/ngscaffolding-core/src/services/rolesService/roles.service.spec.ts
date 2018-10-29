import { UserAuthorisationBase } from '../userAuthorisation/UserAuthorisationBase';
import { TestBed, inject } from '@angular/core/testing';
import { RolesService } from '../rolesService/roles.service';

describe('RolesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RolesService,
        {
          provide: UserAuthorisationBase,
          useValue: { currentUser: { roles: ['users', 'admin'] } }
        }
      ]
    });
  });

  it('User NOT in user group When no Groups Defined',
    inject([RolesService], (rolesService: RolesService) => {
      rolesService.userAuth.currentUser.roles = [];
      expect(rolesService.isInRole('users')).toEqual(false);
    })
  );

  it('User is in user group',
    inject([RolesService], (rolesService: RolesService) => {
      expect(rolesService.isInRole('users')).toEqual(true);
    })
  );

  it('User is NOT in XXuserXX group',
    inject([RolesService], (rolesService: RolesService) => {
      expect(rolesService.isInRole('XXuserXX')).toEqual(false);
    })
  );

  it('User is in one of these groups',
    inject([RolesService], (rolesService: RolesService) => {
      expect(rolesService.isInRoles(['role1', 'role2', 'users'])).toEqual(true);
    })
  );

  it('User is NOT in one of these groups',
    inject([RolesService], (rolesService: RolesService) => {
      expect(rolesService.isInRoles(['role1', 'role2', 'role3'])).toEqual(
        false
      );
    })
  );

  it('Route/Role Repository - Roles for Route',
    inject([RolesService], (rolesService: RolesService) => {
      rolesService.addRouteRoles('/route1:test', ['admin', 'users']);
      expect(rolesService.getRouteRoles('/route1:test'))
      .toEqual(['admin', 'users']);
    })
  );

  it('Route/Role Repository - No Roles for Route',
  inject([RolesService], (rolesService: RolesService) => {
    rolesService.addRouteRoles('/route1:test', ['admin', 'users']);
    expect(rolesService.getRouteRoles('/route1:notest'))
    .toEqual(undefined);
  })
);
});
