import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { UserManager, UserManagerSettings, User } from 'oidc-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserAuthenticationBase } from './UserAuthenticationBase';
import { BasicUser } from 'ngscaffolding-models';
import { AuthenticationStore } from './userAuthentication.store';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root'
})
export class OAuthService implements UserAuthenticationBase {
    private manager = new UserManager(getClientSettings());
    private user: User | null;
    private jwtHelper: JwtHelperService;

    constructor(private authStore: AuthenticationStore) {
        this.jwtHelper = new JwtHelperService({});
        this.manager.getUser().then(user => {
            this.user = user;
            this.setToken(this.user.access_token);
        });
    }

    getToken(): string {
        return this.user.access_token;
    }
    forceLogon() {
        this.logon();
    }
    logon(userName = '', password = '') {
        return this.manager.signinRedirect();
    }
    async logoff() {
        await this.manager.signoutRedirect();
    }
    async completeAuthentication() {
        this.user = await this.manager.signinRedirectCallback();
        this.setToken(this.user.access_token);
    }
    isAuthenticated(): boolean {
        this.manager.getUser().then(user => {
            this.user = user;
        });
        return this.user != null && !this.user.expired;
    }
    authorizationHeaderValue() {
        return `${this.user.token_type} ${this.user.access_token}`;
    }
    name(): string {
        return this.user != null ? this.user.profile.name : '';
    }

    private setToken(token: any) {
        // New AuthUser Based on Token
        const tokenDetails = this.jwtHelper.decodeToken(token);

        const newUser = new BasicUser();

        if (tokenDetails['name']) {
            newUser.name = tokenDetails['name'];
        } else if (tokenDetails['firstName'] && tokenDetails['lastName']) {
            newUser.name = tokenDetails['firstName'] + ' ' + tokenDetails['lastName'];
        }

        if (tokenDetails['role']) {
            newUser.role = tokenDetails['role'];
        }

        if (tokenDetails['email']) {
            newUser.userId = tokenDetails['email'];
            newUser.email = tokenDetails['email'];
        }

        this.authStore.update({ token: token, userDetails: newUser, authenticated: true });
    }
}

export function getClientSettings(): UserManagerSettings {
    return {
        authority: 'https://drasso.azurewebsites.net/',
        client_id: 'DiscoverRADashboardClient',
        redirect_uri: 'http://localhost:4200/signin-oidc',
        post_logout_redirect_uri: 'http://localhost:4200/signout-callback-oidc',
        response_type: 'id_token token',
        scope: 'openid profile offline_access operationsAPI roles',
        filterProtocolClaims: true,
        loadUserInfo: true,
        automaticSilentRenew: true,
        silent_redirect_uri: 'http://localhost:4200/silent-refresh.html'
    };
}
