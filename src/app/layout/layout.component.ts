import {Component, Inject, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {NavigationStart, Router, RouterOutlet} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {Subject, Subscription} from 'rxjs';
import {AuthService} from '../../../projects/auth/src/lib/services/auth';
import {TypeGuards} from '../services/type-guard';
import {TOKEN, USER_STORAGE} from '../app.token';
import {Token} from '../../../projects/auth/src/lib/services/token';
import {User} from '../../../projects/common/user';
import {GoogleAnalyticEventsService} from '../services/google-analytic-events.service';
import {slideInAnimation} from '../animations/animations';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  animations: [
    slideInAnimation
  ]
})
export class LayoutComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject();
  constructor(private router: Router,
              private authService: AuthService,
              private googleAnalyticEventsService: GoogleAnalyticEventsService,
              @Inject(TOKEN) private token: Token,
              @Inject(USER_STORAGE) private userStorage: Storage
  ) { }



  openedSide: boolean = false;
  object: object;
  isAuthenticated: boolean = false;
  isAuthSubscription: Subscription;
  isAdminSubscription: Subscription;
  isAdmin: boolean = false;

  get header(): TemplateRef<any> {
    if (this.object && TypeGuards.isHeaderAwareComponent(this.object)) {
      return this.object.header;
    }
    return undefined;
  }

  get user(): User {
    let user: User = JSON.parse(this.userStorage.getItem('current'));
    return user;
  }

  get search(): TemplateRef<any> {
    if (this.object && TypeGuards.isSearchAwareComponent(this.object)) {
      return this.object.search;
    }
    return undefined;
  }

  get options(): TemplateRef<any> {
    if (this.object && TypeGuards.isOptionsAwareComponent(this.object)) {
      return this.object.options;
    }
    return undefined;
  }

  ngOnInit(): void {
    this.router.events.pipe(takeUntil(this.onDestroy$)).subscribe(value => {
      if (value instanceof NavigationStart) {
        this.openedSide = false;
      }
    });
    this.token.token.pipe(takeUntil(this.onDestroy$)).subscribe(
      (token) => {
        this.isAuthenticated = false;
        if (token)  {
          this.isAuthenticated = true;
        }
        // TODO: Doesn't work after a sign up
        this.isAdmin = false;
        let user: User = JSON.parse(this.userStorage.getItem('current'));
        if (user && user.role === 'admin') {
          this.isAdmin = true;
        }
      }
    );
  }

  public componentChangeed(object: object): void {
    this.object = object;
    let user: User = JSON.parse(this.userStorage.getItem('current'));
    this.googleAnalyticEventsService.navigate(user);
  }

  public clearComponent(): void {
    delete this.object;
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.isAuthSubscription.unsubscribe();
    this.isAdminSubscription.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
  }

  prepareRoute(outlet: RouterOutlet): any {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }
}
