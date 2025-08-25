import { AsyncPipe, CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';
import { Select2Data, Select2Module, Select2UpdateEvent } from 'ng-select2-component';
import { Observable, map } from 'rxjs';
import { PageWrapperComponent } from '../../shared/components/page-wrapper/page-wrapper.component';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import { FormFieldsComponent } from '../../shared/components/ui/form-fields/form-fields.component';
import { ImageUploadComponent } from '../../shared/components/ui/image-upload/image-upload.component';
import * as data from '../../shared/data/country-code';
import * as media from '../../shared/data/media-config';
import { AccountUser } from "../../shared/interface/account.interface";
import { Attachment } from '../../shared/interface/attachment.interface';
import { Stores } from '../../shared/interface/store.interface';
import { UpdateUserPassword, UpdateUserProfile } from '../../shared/store/action/account.action';
import { AccountState } from '../../shared/store/state/account.state';
import { CountryState } from '../../shared/store/state/country.state';
import { StateState } from '../../shared/store/state/state.state';
import { StoreState } from '../../shared/store/state/store.state';
import { CustomValidators } from '../../shared/validator/password-match';
import { appConfig } from 'src/app/core/config/config';

@Component({
    selector: 'app-account',
    imports: [TranslateModule, FormsModule, ReactiveFormsModule,
        NgbModule, CommonModule, Select2Module,
        PageWrapperComponent, FormFieldsComponent, 
      ButtonComponent,
      AsyncPipe
    ],
    templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
    standalone:true
})
export class AccountComponent {

  user$: Observable<any> = inject(Store).select(AccountState.user);
  store$: Observable<Stores> = inject(Store).select(StoreState.selectedStore) as Observable<Stores>;
  countries$: Observable<Select2Data> = inject(Store).select(CountryState.countries) as Observable<Select2Data>;
  roleName$: Observable<string> = inject(Store).select(AccountState.getRoleName) as Observable<string>;

  public active = 'profile';
  public profileForm: FormGroup;
  public passwordForm: FormGroup;
  public form: FormGroup;
  public codes = data.countryCodes;
  public states$: Observable<Select2Data>;
  public flicker: boolean = false;
  public mediaConfig = media.mediaConfig;
  public isBrowser: boolean;
  userId: any;
  constructor(private store: Store, private formBuilder: FormBuilder, @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.user$.subscribe(user => {
      this.userId = user.id;
      this.profileForm = this.formBuilder.group({
        fname: new FormControl(user?.first_name, [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(50),
            Validators.pattern(appConfig.pattern.NAME)
          ]), 
        lname: new FormControl(user?.last_name, [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(50),
            Validators.pattern(appConfig.pattern.NAME)
          ]),
        email: new FormControl(user?.email, [Validators.required, Validators.pattern(appConfig.pattern.EMAIL)]),
        phone: new FormControl(user?.phone, [Validators.required, Validators.pattern(appConfig.pattern.SIMPLE_PHONE_NO)]),
        dial_code: new FormControl(user?.dial_code, [Validators.required])
      });

      this.flicker = true;

      setTimeout( () => this.flicker = false, 200);
    });

    this.passwordForm = this.formBuilder.group({
      current_password: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      password_confirmation: new FormControl('', [Validators.required])
    },{validator : CustomValidators.MatchValidator('password', 'password_confirmation')});
  }

  ngOnInit() {
   
  }

  get passwordMatchError() {
    return (
      this.passwordForm?.getError('mismatch') &&
      this.passwordForm?.get('password_confirmation')?.touched
    );
  }

  selectCode(data: Select2UpdateEvent) {
    this.profileForm.controls['dial_code'].setValue(data?.value);
  }


  profileFormSubmit() {
    this.profileForm.markAllAsTouched();
    if (this.profileForm.valid) {

      this.store.dispatch(new UpdateUserProfile(this.profileForm.value,this.userId));
    }
  }

  passwordFormSubmit() {
    this.passwordForm.markAllAsTouched();
    if(this.passwordForm.valid) {
      this.store.dispatch(new UpdateUserPassword(this.passwordForm.value, this.userId)).subscribe(()=> this.passwordForm.reset())
    }
  }

  selectStoreLogo(data: Attachment) {
    if(!Array.isArray(data)) {
      this.form.controls['store_logo_id'].setValue(data ? data.id : '');
    }
  }

}
