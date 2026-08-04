import { Component, Inject, inject, Input, PLATFORM_ID } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { RoleState } from '../../../shared/store/state/role.state';
import { Observable, Subject, finalize, forkJoin, mergeMap, of, switchMap, take, takeUntil } from 'rxjs';
import { Select2Data, Select2Module } from 'ng-select2-component';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { countryCodes } from '../../../shared/data/country-code';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidators } from '../../../shared/validator/password-match';
import { GetRoles } from '../../../shared/store/action/role.action';
import { CreateUser, EditUser, SetLoadingState, UpdateUser } from '../../../shared/store/action/user.action';
import { UserState } from '../../../shared/store/state/user.state';
import { TranslateModule } from '@ngx-translate/core';
import { FormFieldsComponent } from '../../../shared/components/ui/form-fields/form-fields.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { UserService } from 'src/app/core/services/user.service';
import { LoaderComponent } from "../../../shared/components/loader/loader.component";
import { appConfig } from 'src/app/core/config/config';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { GLOBALF } from 'src/app/core/utils/my_library';

@Component({
  selector: 'app-form-user',
  imports: [TranslateModule, FormsModule, ReactiveFormsModule,
  Select2Module, CommonModule, ButtonComponent, FormFieldsComponent, LoaderComponent],
  templateUrl: './form-user.component.html',
  styleUrl: './form-user.component.scss'
})
export class FormUserComponent {

  @Input() type: string;
  public store = inject(Store)
  role$: Observable<Select2Data> = this.store.select(RoleState.roles);
  isLoading$: Observable<boolean> = this.store.select(UserState.isLoading);

  public form: FormGroup;
  public id: number;
  public codes = countryCodes;

  private destroy$ = new Subject<void>();
  public isBrowser: boolean;

  constructor(
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router, private formBuilder: FormBuilder, @Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);

    
    this.form = this.formBuilder.group({
      first_name: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(appConfig.pattern.NAME)
      ]),

      last_name: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(appConfig.pattern.NAME)
      ]),
      email: new FormControl('', [Validators.required, Validators.pattern(appConfig.pattern.EMAIL)]),

      phone: new FormControl('', [Validators.required, Validators.pattern(appConfig.pattern.SIMPLE_PHONE_NO)]),
      dial_code: new FormControl('234', [Validators.required]),
      role: new FormControl(0, [Validators.required]),
      password: new FormControl(''),
      password_confirmation: new FormControl(''),
      status: new FormControl(1)
    },{
      validator : CustomValidators.MatchValidator('password', 'password_confirmation')
    })
  }

  get passwordMatchError() {
    return (
      this.form.getError('mismatch') &&
      this.form.get('password_confirmation')?.touched
    );
  }

  ngOnInit() {
    // Populate the role dropdown — previously relied on the roles list already
    // being loaded by a prior visit to /user/role, so navigating straight here
    // (e.g. a bookmarked /user/create link) would show an empty dropdown.
    this.store.dispatch(new GetRoles({}));

    if (this.type === 'edit') {
      // Clear validators if editing
      this.form.get('password')?.clearValidators();
      this.form.get('password_confirmation')?.clearValidators();
      this.form.clearValidators(); // clear form-level validators like MatchValidator
    } else {
      // Set validators if creating
      this.form.get('password')?.setValidators([Validators.required]);
      this.form.get('password_confirmation')?.setValidators([Validators.required]);
      this.form.setValidators(CustomValidators.MatchValidator('password', 'password_confirmation'));
    }
  
    // Update form validity after setting validators
    this.form.get('password')?.updateValueAndValidity();
    this.form.get('password_confirmation')?.updateValueAndValidity();
    this.form.updateValueAndValidity();

    // Check if there's any state
    if (this.type === 'edit') {
      this.route.params
        .pipe(
          switchMap(params => {
            const id = +params['id'];
            if (!id) return of(null);
            // Dispatch action to fetch and store the user
            return this.store.dispatch(new EditUser(id)).pipe(
              switchMap(() => this.store.select(UserState.selectedUser).pipe(take(1)))
            );
          }),
          takeUntil(this.destroy$)
        )
        .subscribe((user: any) => {
          if (user) {
            this.id = user.id;
            this.form.patchValue({
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,
              phone: user.phone,
              dial_code: user.dial_code,
              role: user.role_id,
              status: user.is_activated == 1 ? 1 : 0
            });
          }
        });
    }
    // Listen for changes on 'fname' and capitalize the first letter
    this.form.controls['first_name'].valueChanges.subscribe(value => {
      this.capitalizeFirstLetter('first_name', value);
    });

    // Listen for changes on 'lname' and capitalize the first letter
    this.form.controls['last_name'].valueChanges.subscribe(value => {
      this.capitalizeFirstLetter('last_name', value);
    });
  }
   // Function to capitalize the first letter
  capitalizeFirstLetter(controlName: string, value: string) {
    if (value && value.length > 0) {
      const capitalized = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      // Only update the form control value if it's different
      if (this.form.get(controlName)?.value !== capitalized) {
        this.form.get(controlName)?.setValue(capitalized, { emitEvent: false });
      }
    }
  }

  submit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }

    let payload = { ...this.form.value };
    payload.member_id = GLOBALF.genrateMemberId();
    payload.account_type = appConfig.roles.ADMIN;
    payload.is_activated = payload.status ? 1 : 0;
    // account_type stays the coarse "this is an admin-panel staff account" marker;
    // role_id is the actual fine-grained RBAC role picked in the form above.
    payload.role_id = payload.role;
    delete payload.role;

    delete payload.password_confirmation;
    // Dispatch the loading action to set loading state to true in the store
    this.store.dispatch(new SetLoadingState(true));
    
    let action:any;
    
    if (this.type == 'edit' && this.id) {
      this.form.removeControl('password');
      this.form.removeControl('password_confirmation');
      payload.status = payload.status ? 1 : 0;

      action = new UpdateUser(payload, this.id);
    }

    if(this.type === 'create') {
      //connect to the backend   
      action = new CreateUser(payload);
    }
    this.store
    .dispatch(action)
    .pipe(
      finalize(() => (this.store.dispatch(new SetLoadingState(false)))),
      takeUntil(this.destroy$)
    ).subscribe({
    next: (res: any) => {
      const response = res?.user?.response;
      if (response?.status === appConfig.statusCode.created) {
        this.notificationService.showSuccess(response?.message);
        this.router.navigateByUrl('/user/all-users');
      } else {
        this.notificationService.showError(response?.message);
      }
    },
    error: (err) => {
      this.notificationService.showError(err?.message || 'An unexpected error occurred');
    }
  });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
