import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, RouterOutlet } from '@angular/router';
import { NgbNavConfig } from '@ng-bootstrap/ng-bootstrap';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { TranslateService } from '@ngx-translate/core';
import { Actions, Select, Store, ofActionDispatched } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Values } from './shared/interface/setting.interface';
import { Logout } from './shared/store/action/auth.action';
import { GetCountries } from './shared/store/action/country.action';
import { GetSettingOption } from './shared/store/action/setting.action';
import { GetStates } from './shared/store/action/state.action';
import { SettingState } from './shared/store/state/setting.state';
import { InactivityService } from '../../../jointcrest-app/src/app/core/services/inactivity.service';
import { ConsoleToggleService } from '../../../jointcrest-app/src/app/core/services/console-toggle.service';
import { AuthService } from './core/services/auth.service';
import { NetworkService } from './core/services/network.service';
import { AccountState } from './shared/store/state/account.state';
import { NotificationService } from './shared/services/notification.service';

@Component({
    selector: 'app-root',
    imports: [CommonModule, RouterOutlet, LoadingBarRouterModule],
    templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
    standalone: true
})
export class AppComponent {

  setting$: Observable<Values> = inject(Store).select(SettingState.setting) as Observable<Values>;

  public favIcon: HTMLLinkElement | null;

  private lastStatus: boolean | null = null;

  user$: Observable<any> = inject(Store).select(AccountState.user);

  constructor(config: NgbNavConfig,
    @Inject(DOCUMENT) document: Document,
    private actions: Actions, private router: Router,
    private titleService: Title, private store: Store,
    private network: NetworkService,
    private authService: AuthService,
    private inactivityService: InactivityService,
    private consoleToggleService: ConsoleToggleService,
    private notify: NotificationService,
    private translate: TranslateService) {
    
     // Initialize network detection
     this.networkDetector();
     //check if token is expired
     this.authService.isTokenExpired();
     // disable console in prod
     this.consoleToggleService.disableConsole();
     //check inactivity session timeout
     if (this.user$) {
       this.inactivityService.initListener();
     }
    
    
    this.translate.use('en');
    this.store.dispatch(new GetCountries());
    this.store.dispatch(new GetStates());
    // this.store.dispatch(new GetSettingOption());
    this.setting$.subscribe(setting => {
      // Set Direction
      if(setting?.general?.admin_site_language_direction === 'rtl'){
        document.getElementsByTagName('html')[0].setAttribute('dir', 'rtl');
        document.body.classList.add('ltr');
      }else {
        document.getElementsByTagName('html')[0].removeAttribute('dir');
        document.body.classList.remove('ltr');
      }

      // Set Favicon
      this.favIcon = document.querySelector('#appIcon');
      if(this.favIcon && this.favIcon.href)
        this.favIcon.href = setting?.general?.favicon_image?.original_url!;

      // Set site title
      this.titleService.setTitle(setting?.general?.site_title && setting?.general?.site_tagline ?
        `${setting?.general?.site_title} | ${setting?.general?.site_tagline}` : 'Marketplace: Where Vendors Shine Together' )
    });

    // customize default values of navs used by this component tree
		config.destroyOnHide = false;
		config.roles = false;

    this.actions.pipe(ofActionDispatched(Logout)).subscribe(() => {
      this.router.navigate(['/auth/login']);
    });
  }


  networkDetector() { 
    this.network.connectionChanges.subscribe(isOnline => {
      if (this.lastStatus !== null && this.lastStatus !== isOnline) {
        if (isOnline) {
          this.notify.showSuccess('Back online');
        } else {
          this.notify.showError('⚠️ You’re offline');
        }
      }
      this.lastStatus = isOnline;
    });
} 
}
