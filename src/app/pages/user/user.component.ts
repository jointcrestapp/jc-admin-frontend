import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PageWrapperComponent } from '../../shared/components/page-wrapper/page-wrapper.component';
import { TableComponent } from '../../shared/components/ui/table/table.component';
import { ImportCsvModalComponent } from '../../shared/components/ui/modal/import-csv-modal/import-csv-modal.component';
import { Select, Store } from '@ngxs/store';
import { UserState } from '../../shared/store/state/user.state';
import { Observable, Subject, takeUntil } from 'rxjs';
import { User, UserModel } from '../../shared/interface/user.interface';
import { TableClickedAction, TableConfig } from '../../shared/interface/table.interface';
import { Params } from '../../shared/interface/core.interface';
import { DeleteAllUser, DeleteUser, ExportUser, GetUsers, UpdateUserStatus } from '../../shared/store/action/user.action';
import { HasPermissionDirective } from '../../shared/directive/has-permission.directive';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/core/services/user.service';
import { appConfig } from 'src/app/core/config/config';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
    selector: 'app-user',
    imports: [RouterModule, TranslateModule, HasPermissionDirective,
        PageWrapperComponent, TableComponent, ImportCsvModalComponent, CommonModule
    ],
    templateUrl: './user.component.html',
    styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private store = inject(Store);
  allUsers: any[];
  user$: Observable<UserModel[]> = this.store.select(UserState.user);
  isLoading$: Observable<boolean> = this.store.select(UserState.isLoading);

  @ViewChild("csvModal") CSVModal: ImportCsvModalComponent;
  
  @ViewChild(TableComponent) confirmAction: TableComponent;  // Get reference to the modal component in the table component
  
  public tableConfig: TableConfig = {
    columns: [
      { title: "avatar", dataField: "profile_image", class: 'tbl-image rounded-circle', type: 'image' },
      { title: "First name", dataField: "first_name", sortable: true, sort_direction: 'desc' },
      { title: "Last name", dataField: "last_name", sortable: true, sort_direction: 'desc' },
      { title: "Email", dataField: "email" },
      { title: "Role", dataField: "role_name" },
      { title: "created_at", dataField: "createdAt", type: "date", sortable: true, sort_direction: 'desc' },
      { title: "Status", dataField: "status", type: "switch" },
    ],
    rowActions: [
      { label: "Edit", actionToPerform: "edit", icon: "ri-pencil-line", permission: "user.edit" },
      { label: "Detail", actionToPerform: "detail", icon: "ri-eye-line", permission: "user.view" },
      { label: "Delete", actionToPerform: "delete", icon: "ri-delete-bin-line", permission: "user.destroy" },
    ],
    //data: [] as User[],
    data: [] as any,
    total: 0
  };
  
  constructor(
    private notificationService: NotificationService,
    private userService: UserService,
    public router: Router) { }
/* 
  ngAfterViewInit() {
    // Listen for the emitted event
    this.confirmAction.action.subscribe((event) => {
      this.onActionReceived(event);  // Handle the event in the parent component
    });
  }
  onActionReceived(event: any) { 
    if (event.actionToPerform == 'status') { 
       this.deactivateUser(event.data.id)
    }
  }
 */
  ngOnInit() {
    this.getUsers();
     this.user$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.tableConfig.data = data;
      this.tableConfig.total = data.length;
    });
  }

  getUsers(): void {
    this.store.dispatch(new GetUsers({ role: 'admin' }));
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  

  onTableChange(data?: Params) {
    this.getUsers(); // handle filter/pagination later
  }

  onActionClicked(action: TableClickedAction) {
    
    if (action.actionToPerform == 'edit')
      this.edit(action.data)
    else if (action.actionToPerform == 'status')
      this.status(action.data)
    else if (action.actionToPerform == 'detail')
      this.view(action.data)
    else if(action.actionToPerform == 'delete')
      this.delete(action.data)
    else if(action.actionToPerform == 'deleteAll')
      this.deleteAll(action.data)
  }

  edit(data: any) {
    this.router.navigateByUrl(`/user/edit/${data.id}`);
  }
  view(data: any) {
    this.router.navigateByUrl(`/user/detail/${data.id}`);
  }

  status(data: any) {
    this.store.dispatch(new UpdateUserStatus(data.id, data.status)).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: any) => {
        const response = res?.user?.response; 
        if (response.status === appConfig.statusCode.ok) {
            this.notificationService.showSuccess(response.message);
            this.getUsers();  // Refresh the list after status update
        }    
      },
      error: (err) => {
        this.notificationService.showError(err?.message || 'Failed to update user status');
      }
    });
  }

  delete(data: any) {
    this.store.dispatch(new DeleteUser(data.id)).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: any) => {
        const response = res?.user?.response; 
        if (response.status === appConfig.statusCode.ok) {
            this.notificationService.showSuccess(response.message);
            this.getUsers();  // Refresh the list after status update
        }    
      },
      error: (err) => {
        this.notificationService.showError(err?.message || 'Failed to delete user!');
      }
    });
  }

  deleteAll(ids: number[]) {
    this.store.dispatch(new DeleteAllUser(ids));
  }

  export() {
    this.store.dispatch(new ExportUser());
  }
}
