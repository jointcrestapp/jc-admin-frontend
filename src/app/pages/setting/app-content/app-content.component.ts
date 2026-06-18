import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { finalize, Observable, Subject, takeUntil } from 'rxjs';
import { appConfig } from 'src/app/core/config/config';
import { NotificationService } from 'src/app/shared/services/notification.service';
import {
  addUpdateFinancialSettings,
  GetFinancialSettingsList,
} from 'src/app/shared/store/action/financial-settings.action';
import { FinancialSettingsState } from 'src/app/shared/store/state/financial-settings.state';
import { PageWrapperComponent } from 'src/app/shared/components/page-wrapper/page-wrapper.component';
import { ButtonComponent } from 'src/app/shared/components/ui/button/button.component';
import { FormFieldsComponent } from 'src/app/shared/components/ui/form-fields/form-fields.component';

@Component({
  selector: 'app-app-content',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PageWrapperComponent,
    ButtonComponent,
    FormFieldsComponent,
  ],
  templateUrl: './app-content.component.html',
  styleUrl: './app-content.component.scss',
})
export class AppContentComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public type: 'create' | 'edit' = 'create';
  public id: number | null = null;
  private destroy$ = new Subject<void>();

  @Select(FinancialSettingsState.financialSettings) settings$: Observable<any>;
  @Select(FinancialSettingsState.isLoading) isLoading$: Observable<boolean>;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private notificationService: NotificationService,
  ) {
    this.form = this.fb.group({
      welcome_video_url: [''],
    });
  }

  ngOnInit() {
    this.store.dispatch(new GetFinancialSettingsList());

    this.settings$.pipe(takeUntil(this.destroy$)).subscribe((settings) => {
      if (settings) {
        this.id = settings.id;
        this.type = 'edit';
        this.form.patchValue({ welcome_video_url: settings.welcome_video_url || '' });
      }
    });
  }

  submit() {
    const payload: any = { ...this.form.value, type: this.type };
    if (this.type === 'edit') payload.id = this.id;

    this.store
      .dispatch(new addUpdateFinancialSettings(payload))
      .pipe(
        finalize(() => {}),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: (res: any) => {
          const response = res?.financialSettings?.response;
          if (response?.status === appConfig.statusCode.ok) {
            this.notificationService.showSuccess(
              response?.message || 'App content settings saved successfully',
            );
          } else {
            this.notificationService.showError(response?.message || 'Save failed');
          }
        },
        error: (err) => {
          this.notificationService.showError(err?.message || 'An unexpected error occurred');
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
