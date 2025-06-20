import { Component, inject } from '@angular/core';
import { Params, Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HasPermissionDirective } from '../../../shared/directive/has-permission.directive';
import { PageWrapperComponent } from '../../../shared/components/page-wrapper/page-wrapper.component';
import { TableComponent } from '../../../shared/components/ui/table/table.component';
import { Select, Store } from '@ngxs/store';
import { RoleState } from '../../../shared/store/state/role.state';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Role, RoleModel } from '../../../shared/interface/role.interface';
import { TableClickedAction, TableConfig } from '../../../shared/interface/table.interface';
import { DeleteAllRole, DeleteRole, GetRoles } from '../../../shared/store/action/role.action';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { appConfig } from 'src/app/core/config/config';

@Component({
  selector: 'app-role',
  imports: [TranslateModule, RouterModule, HasPermissionDirective,
    PageWrapperComponent, TableComponent
  ],
  templateUrl: './role.component.html',
  styleUrl: './role.component.scss'
})
export class RoleComponent {

  private destroy$ = new Subject<void>();
  role$: Observable<any> = inject(Store).select(RoleState.role);

  public tableConfig: TableConfig = {
    columns: [
      { title: "name", dataField: "name", sortable: true, sort_direction: 'desc' },
      { title: "created_at", dataField: "createdAt", type: "date", sortable: true, sort_direction: 'desc' }
    ],
    rowActions: [
      { label: "Edit", actionToPerform: "edit", icon: "ri-pencil-line", permission: "role.edit" },
      { label: "Delete", actionToPerform: "delete", icon: "ri-delete-bin-line", permission: "role.destroy" },
    ],
    data: [] as any,
    total: 0
  };

  constructor(
    private store: Store,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.getRoles();
    this.role$.pipe(takeUntil(this.destroy$)).subscribe(role => {
      this.tableConfig.data = role ? role : [];
      this.tableConfig.total = role ? role.length : 0;
    });
  }

  getRoles():void {
    this.store.dispatch(new GetRoles({}));
  }

  onTableChange(data?: Params) {
    this.store.dispatch(new GetRoles(data!));
  }

  onActionClicked(action: TableClickedAction) {
    if(action.actionToPerform == 'edit')
      this.edit(action.data)
    else if(action.actionToPerform == 'delete')
      this.delete(action.data)
    else if(action.actionToPerform == 'deleteAll')
      this.deleteAll(action.data)
  }

  edit(data: Role) {
    this.router.navigateByUrl(`/user/edit-role/${data.id}`);
  }

  delete(data: Role) {
    this.store.dispatch(new DeleteRole(data.id)).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: any) =>{
        const response = res?.role?.response;
        if (response.status === appConfig.statusCode.ok) {
          this.notificationService.showSuccess(response.message);
          this.getRoles();
        }   
      },
      error: (err) => {
        this.notificationService.showError(err?.message || 'Failed to delete role!');
      }
    })
  }

  deleteAll(ids: number[]) {
    this.store.dispatch(new DeleteAllRole(ids)).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: any) => {
        const response = res?.role?.response; 
        if (response.status === appConfig.statusCode.ok) {
          this.notificationService.showSuccess(response.message);
          this.getRoles();  
        }    
      },
      error: (err) => {
        this.notificationService.showError(err?.message || 'Failed to delete role!');
      }
    });
  }

}
