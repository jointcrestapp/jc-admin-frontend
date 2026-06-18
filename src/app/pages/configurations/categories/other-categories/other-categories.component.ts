import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; // FIXED: Added Validators here
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Select2Module } from 'ng-select2-component';
import { NgxEditorModule } from 'ngx-editor'; // FIXED: Removed Validators from here
import { PageWrapperComponent } from 'src/app/shared/components/page-wrapper/page-wrapper.component';
import { ButtonComponent } from 'src/app/shared/components/ui/button/button.component';
import { FormFieldsComponent } from 'src/app/shared/components/ui/form-fields/form-fields.component';

import {
  SetLoadingState
} from "src/app/shared/store/action/configurations.action";
import { appConfig } from "src/app/core/config/config";
import { NotificationService } from "src/app/shared/services/notification.service";
import { Select, Store } from '@ngxs/store';
import { finalize, Observable, Subject, takeUntil } from 'rxjs';
import { NavService } from 'src/app/shared/services/nav.service';
import { addUpdateFinancialSettings, GetFinancialSettingsList } from 'src/app/shared/store/action/financial-settings.action';
import { FinancialSettingsState } from 'src/app/shared/store/state/financial-settings.state';
import { currency } from '../../../../shared/data/currency';

@Component({
  selector: 'app-other-categories',
  standalone: true,
  imports: [
    PageWrapperComponent,
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    Select2Module,
    RouterModule,
    NgxEditorModule,
    FormFieldsComponent,
    ButtonComponent,
  ],
  templateUrl: './other-categories.component.html',
  styleUrl: './other-categories.component.scss'
})
export class OtherCategoriesComponent implements OnInit {
  public form: FormGroup;
  private destroy$ = new Subject<void>();
  public type: 'create' | 'edit' = 'create';
  public id: number | null = null;
  public isBrowser = typeof window !== 'undefined';
  public currencies: any[] = [
    { value: 'NGN', label: 'Naira (₦)' },
    { value: 'USD', label: 'Dollar ($)' }
  ];
  public tabError: string[] | null = [];
  
  @Select(FinancialSettingsState.financialSettings) settings$: Observable<any>;
  currency: string;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    public navServices: NavService,
    private notificationService: NotificationService,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.form = this.fb.group({
      activation_fee: [0, [Validators.required, Validators.min(0)]],
      shares_amount: [0, [Validators.required, Validators.min(0)]],
      min_deposit: [0, [Validators.required, Validators.min(0)]],
      min_withdrawal: [0, [Validators.required, Validators.min(0)]],
      max_withdrawal: [0, [Validators.required, Validators.min(0)]],
      min_withdrawal_fee: [0, [Validators.required, Validators.min(0)]],
      max_withdrawal_fee: [0, [Validators.required, Validators.min(0)]],
      withdrawal_percent: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      dividend_percent: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      fixed_loan_fee: [0, [Validators.required, Validators.min(0)]],
      subscription_fee: [0, [Validators.required, Validators.min(0)]],
      subscription_grace_period: [0, [Validators.required, Validators.min(0)]],
      min_transfer_amount: [0, [Validators.required, Validators.min(0)]],
      credit_sales_limit: [50000, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
   // 1. Dispatch action to fetch data from your DigitalOcean server
    this.store.dispatch(new GetFinancialSettingsList());

    // 2. Subscribe to the state and prefill the form
    this.settings$
      .pipe(takeUntil(this.destroy$))
      .subscribe(settings => {
        if (settings) {
          this.currency = settings.currency;
          this.id = settings.id;
          console.log('Financial Settings fetched:', settings);
          // patchValue maps matching keys from the API directly to your form
          if (settings) {
            this.form.patchValue(settings);
            this.type = 'edit'; 
          }
          
        }
      });
  }

  submit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }
    let payload = {};
    if (this.type  === 'create') {
        payload = { ...this.form.value,type:this.type};
    } else { 
        payload = { ...this.form.value,type:this.type, id:this.id};
    }
    
      let action: any;  
      action = new addUpdateFinancialSettings(payload);
    
    
    this.store
          .dispatch(action)
          .pipe(
            finalize(() => this.store.dispatch(new SetLoadingState(false))),
            takeUntil(this.destroy$)
          )
          .subscribe({
            next: (res: any) => {
              
              const response = res?.financialSettings?.response;
                
              if (response?.status === appConfig.statusCode.ok) {
                const successMessage =
                  this.type === "edit"
                    ? "Financial settings updated successfully"
                    : "Financial settings created successfully";
                this.notificationService.showSuccess(
                  response?.message || successMessage
                );
                this.router.navigateByUrl("/configurations/categories");
                this.tabError = [];
              } else {
                this.tabError = [];
                this.notificationService.showError(
                  response?.message || "Update failed"
                );
              }
            },
            error: (err) => {
              this.notificationService.showError(
                err?.message || "An unexpected error occurred"
              );
            },
          });
    
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.form.reset();
    this.renderer.removeClass(this.document.body, "loader-none");
  }
}