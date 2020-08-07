import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiLanguageService } from 'ng-jhipster';
import { SessionStorageService } from 'ngx-webstorage';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';

import { VERSION } from 'app/app.constants';
import { JhiLanguageHelper } from 'app/core/language/language.helper';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/user/account.model';
import { LoginService } from 'app/core/login/login.service';
import { ProfileService } from 'app/layouts/profiles/profile.service';

@Component({
  selector: 'jhi-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['navbar.scss']
})
export class NavbarComponent implements OnInit {
  inProduction: boolean;
  isNavbarCollapsed: boolean;
  languages: any[];
  swaggerEnabled: boolean;
  modalRef: NgbModalRef;
  version: string;
  showArrow: string;
  previousUrl: string;
  currentUrl: string;
  account$: Observable<Account>;
  information: any = {};

  constructor(
    private loginService: LoginService,
    private languageService: JhiLanguageService,
    private languageHelper: JhiLanguageHelper,
    private sessionStorage: SessionStorageService,
    private accountService: AccountService,
    private profileService: ProfileService,
    private router: Router,
    private location: Location
  ) {
    this.version = VERSION ? (VERSION.toLowerCase().startsWith('v') ? VERSION : 'v' + VERSION) : '';
    this.isNavbarCollapsed = true;

    this.currentUrl = this.router.url;

    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = ev.url;
        if (this.router.url !== '/menu') {
          this.showArrow = 'show';
        } else {
          this.showArrow = null;
          this.checkAdminNavbar();
        }
      }
    });
  }

  navigateBack() {
    let pageBack = '';

    const regex = /[+-]?\d+(?:\.\d+)?/g;
    const idRoute = regex.exec(this.router.url);
    // eslint-disable-next-line no-console
    console.log(idRoute);
    if (idRoute !== null) {
      switch (this.router.url) {
        case '/account/password':
        case `/finding/${idRoute[0]}/findView`:
          pageBack = '/finding/records';
          break;
        case `/finding/${idRoute[0]}/tracking`:
          pageBack = '/finding/records';
          break;
        case `/closures/${idRoute[0]}/create`:
          pageBack = '/finding/records';
          break;
        case `/closures/${idRoute[0]}/verify`:
          pageBack = '/finding/records';
          break;
        case `/activity/${idRoute[0]}/info`:
          pageBack = '/activity/records';
          break;
        case `/activity/${idRoute[0]}/modify`:
          pageBack = '/activity/records';
          break;
        case `/document/${idRoute[0]}/update`:
          pageBack = '/document/search';
          break;
      }
    } else {
      switch (this.router.url) {
        case '/account/password':
          pageBack = '/menu';
          break;
        case '/finding/create':
          pageBack = '/menu';
          break;
        case '/finding/records':
          pageBack = '/menu';
          break;
        case '/activity/create':
          pageBack = '/menu';
          break;
        case '/activity/records':
          pageBack = '/menu';
          break;
        case 'activity/book':
          pageBack = '/menu';
          break;
        case '/document/create':
          pageBack = '/menu';
          break;
        case '/document/master':
          pageBack = '/menu';
          break;
        case '/document/search':
          pageBack = '/menu';
          break;
      }
    }

    pageBack === '' ? this.location.back() : this.router.navigateByUrl(pageBack);
  }

  ngOnInit() {
    this.languages = this.languageHelper.getAll();

    this.profileService.getProfileInfo().subscribe(profileInfo => {
      this.inProduction = profileInfo.inProduction;
      this.swaggerEnabled = profileInfo.swaggerEnabled;
    });
  }

  checkAdminNavbar(): void {
    this.account$ = this.accountService.identity();
    this.accountService.identity().subscribe(account => {
      const ADMIN = 'ROLE_ADMIN';
      this.information.auth = account.authorities;
      if (this.information.auth.includes(ADMIN)) {
        const Nav = document.getElementById('navUser');
        const Menu = document.getElementById('menuP');
        Nav.style.display = 'none';
        Menu.style.paddingTop = '0px';
      } else {
        // eslint-disable-next-line no-console
        console.log('No soy admin');
      }
    });
  }

  changeLanguage(languageKey: string) {
    this.sessionStorage.store('locale', languageKey);
    this.languageService.changeLanguage(languageKey);
  }

  collapseNavbar() {
    this.isNavbarCollapsed = true;
  }

  isAuthenticated() {
    return this.accountService.isAuthenticated();
  }

  logout() {
    this.collapseNavbar();
    this.loginService.logout();
    this.router.navigate(['']);
  }

  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  getImageUrl() {
    return this.isAuthenticated() ? this.accountService.getImageUrl() : null;
  }
}
