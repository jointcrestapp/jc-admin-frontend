import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { VerifyEmailOtp } from '../../../shared/store/action/auth.action';
import { TranslateModule } from '@ngx-translate/core';
import { AlertComponent } from '../../../shared/components/ui/alert/alert.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { Observable, switchMap } from 'rxjs';
import { Values } from 'src/app/shared/interface/setting.interface';
import { SettingState } from 'src/app/shared/store/state/setting.state';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-otp',
    imports: [TranslateModule, FormsModule, ReactiveFormsModule,
         ButtonComponent
    ],
    templateUrl: './otp.component.html',
  styleUrl: './otp.component.scss',
    standalone: true
})
export class OtpComponent {

  setting$: Observable<Values> = inject(Store).select(SettingState.setting) as Observable<Values>;

  public form: FormGroup;
  public email: string;
  public loading: boolean;
  public token: string;
  otpBoxes = Array(4).fill('');
  otpValues: string[] = ['', '', '', ''];
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public store: Store,
    public formBuilder: FormBuilder
  ) {
    this.token = this.route.snapshot.paramMap.get('t')!;

    this.email = this.store.selectSnapshot(state => state.auth.email);
    if(!this.email) this.router.navigateByUrl('/auth/login'); 
    this.form = this.formBuilder.group({
      otp: new FormControl('', [Validators.required, Validators.minLength(4)])
    });
  }

  login() { 
      this.router.navigateByUrl('/auth/login');    
  }
  goBack(){ 
    this.router.navigateByUrl('/auth/forgot-password');
  }
  submit() {
    this.form.markAllAsTouched();
    if(this.form.valid) {
      this.store.dispatch( new VerifyEmailOtp({
        email: this.email,
        otp: this.form.value.otp,
        token:this.token
      }))
    }
  }

  onOtpInput(event: any, index: number) {
    const value = event.target.value.replace(/[^0-9]/g, '');
    this.otpValues[index] = value;
  
    if (value && index < 3) {
      const nextInput = document.querySelectorAll<HTMLInputElement>('#otp input')[index + 1];
      nextInput?.focus();
    }
  }
  
  onOtpKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace' && !this.otpValues[index] && index > 0) {
      const prevInput = document.querySelectorAll<HTMLInputElement>('#otp input')[index - 1];
      prevInput?.focus();
    }
  }

}
