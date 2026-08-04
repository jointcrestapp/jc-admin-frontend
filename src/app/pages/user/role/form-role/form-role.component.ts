import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Observable, Subject, finalize, mergeMap, of, switchMap, takeUntil } from 'rxjs';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { FormFieldsComponent } from '../../../../shared/components/ui/form-fields/form-fields.component';
import { CreateRole, EditRole, UpdateRole, SetLoadingState  } from '../../../../shared/store/action/role.action';
import { RoleState } from '../../../../shared/store/state/role.state';
import { PermissionsComponent } from '../permissions/permissions.component';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { appConfig } from 'src/app/core/config/config';

@Component({
    selector: 'app-form-role',
    imports: [TranslateModule, FormsModule, ReactiveFormsModule,
        FormFieldsComponent, PermissionsComponent, ButtonComponent
    ],
    templateUrl: './form-role.component.html',
    styleUrl: './form-role.component.scss'
})
export class FormRoleComponent {

  @Input() type: string;

  public form: FormGroup;
  public permissions: string[] = [];
  public id: number;

  isLoading$: Observable<boolean> = this.store.select(RoleState.isLoading);
  private destroy$ = new Subject<void>();

  constructor(private store: Store,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      permissions: new FormControl('', [Validators.required])
    });
  }

  get permissionControl(): FormArray {
    return this.form.get("permissions") as FormArray;
  }

  ngOnInit() {
    if(this.type === 'edit'){
      this.route.params.pipe(
        switchMap(params => {
          if(!params['id']) return of();
          return this.store
            .dispatch(new EditRole(params['id']))
            .pipe(mergeMap(() => this.store.select(RoleState.selectedRole)))
          }
        ),
        takeUntil(this.destroy$)
      ).subscribe(role => {
        let selectedRolePermissions = JSON.parse(role?.permissions)
        this.id = role?.id!;
        let permissions  = selectedRolePermissions.map((permission: any) => permission);
        this.permissions = permissions;
        this.form.patchValue({
          name: role?.name,
          permissions: permissions
        });
      });
    }
  }

  setPermissions(permissions: string[]) {
    if(Array.isArray(permissions)) {
      this.form.controls['permissions'].setValue(permissions);
    }
  }

  submit() {
    this.form.markAllAsTouched();
    const payload = { ...this.form.value };
    let action = new CreateRole(payload);

    this.store.dispatch(new SetLoadingState(true));

    if(this.type == 'edit' && this.id) {
      action = new UpdateRole(this.form.value, this.id)
      this.store.dispatch(action).pipe(
        finalize(() => (this.store.dispatch(new SetLoadingState(false)))),
        takeUntil(this.destroy$)
      ).subscribe({
        next: (res: any) => {
          const response = res?.role?.response;
          if (response?.status === appConfig.statusCode.ok) {
            this.notificationService.showSuccess(response?.message || 'Role updated successfully!');
            this.router.navigateByUrl('/user/role');
          } else {
            this.notificationService.showError(response?.message || 'Role update failed.');
          }
        },
        error: (err) => {
          this.notificationService.showError(err?.message || 'An unexpected error occurred');
        }
      });
    }

    if(this.form.valid && this.type === 'create') {
      this.store.dispatch(action).pipe(
        finalize(() => this.store.dispatch(new SetLoadingState(false))),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res: any) =>{
          const response = res?.role?.response;

          if (response?.status === appConfig.statusCode.created) {
            this.notificationService.showSuccess(response?.message || 'Role created successfully!');
            this.router.navigateByUrl('user/role');
          } else {
            this.notificationService.showError(response?.message || 'Role creation failed.');
          }
        },
        error: (err) => {
          this.notificationService.showError(err?.message || 'An unexpected error occurred');
        }
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
