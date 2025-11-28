import { Component, TemplateRef, ViewChild, Inject, PLATFORM_ID, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { TableClickedAction, TableConfig } from 'src/app/shared/interface/table.interface';
import { GetKYCSubmissions, UpdateKYCStatus, DeleteKYC } from 'src/app/shared/store/action/kyc.action';
import { Subject, Observable, takeUntil } from 'rxjs';
import { KYCState } from 'src/app/shared/store/state/kyc.state';
import { environment } from 'src/environments/environment.development';
import { Select2Module, Select2UpdateEvent } from 'ng-select2-component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PageWrapperComponent } from 'src/app/shared/components/page-wrapper/page-wrapper.component';
import { ImportCsvModalComponent } from 'src/app/shared/components/ui/modal/import-csv-modal/import-csv-modal.component';
import { TableComponent } from 'src/app/shared/components/ui/table/table.component';
import { HasPermissionDirective } from 'src/app/shared/directive/has-permission.directive';
import { Lightbox, LightboxModule } from 'ngx-lightbox';
import { appConfig } from 'src/app/core/config/config';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AuthState } from 'src/app/shared/store/state/auth.state';


declare var bootstrap: any; // Bootstrap modal JS

@Component({
  selector: 'app-kyc-submissions',
  templateUrl: './kyc-submissions.component.html',
  styleUrls: ['./kyc-submissions.component.scss'],
  standalone: true,
  imports:[ RouterModule,
    TranslateModule,
    Select2Module,
    PageWrapperComponent,
    TableComponent,
    LightboxModule,
    CommonModule,]
})
export class KycSubmissionsComponent {
  private destroy$ = new Subject<void>();
  private store = inject(Store);

  submissions$: Observable<any[]> = this.store.select(KYCState.submissions);
  loading$: Observable<boolean> = this.store.select(KYCState.loading);

  @ViewChild("documentTemplate", { static: true }) documentTemplate!: TemplateRef<any>;


  public filter: any = { search: '', field: '', status: '', sort: '', page: 1, paginate: 15 };
  public tableConfig: TableConfig;
  public KYCImage: any;
  _album: any[] = [];

  currentUserId = this.store.selectSnapshot(AuthState.id);

  constructor(@Inject(PLATFORM_ID) private platformId: object,
    private lightbox: Lightbox,
    private notificationService: NotificationService,
  ) {
    this.KYCImage = environment.KYC_PHOTOS;
    
    this.tableConfig = {
        columns: [
          { title: 'Date', dataField: 'createdAt', type: 'date' },
          //{ title: "image", dataField: "src", class: 'tbl-image', type: 'image' },
          { title: 'Document', dataField: 'document_url' },
          { title: 'ID Type', dataField: 'id_type' },
          { title: 'Member ID', dataField: 'member_id' },
          { title: 'First name', dataField: 'first_name' },
          { title: 'Last name', dataField: 'last_name' },
          { title: 'Email', dataField: 'email' },
          { title: 'Status', dataField: 'verification_status_raw' },
          { title: 'Verified By', dataField: 'verified_by_name' },
          { title: 'Rejected By', dataField: 'rejected_by_name' },
        ],
        rowActions: [
          {
            label: 'Verify',
            actionToPerform: 'verify',
            icon: 'ri-check-line',
            conditional: {
              field: 'verification_status_raw',
              condition: '==',
              value: 'PENDING'
            }
          },
          {
            label: 'Reject',
            actionToPerform: 'reject',
            icon: 'ri-close-line',
            conditional: {
              field: 'verification_status_raw',
              condition: '==',
              value: 'PENDING'
            }
          },
          { 
            label: 'Delete',
            actionToPerform: 'delete',
            icon: 'ri-delete-bin-line'
            // you can add role-based permission here later
          },
          {
            label: 'View',
            actionToPerform: 'view',
            icon: 'ri-eye-line'
          }
        ],
        data: [],
        total: 0
    };
  }

  ngOnInit() {
    this.loadKYC();
    this.submissions$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (!data) return;
        const mapped = data.map(m => ({
          ...m,
          member_id: m.member?.member_id,
          first_name: m.member?.first_name,
          last_name: m.member?.last_name,
          email: m.member?.email,

          verified_by_name: m.verifier 
              ? `${m.verifier.first_name} ${m.verifier.last_name}` 
              : null,

          rejected_by_name: m.rejector 
              ? `${m.rejector.first_name} ${m.rejector.last_name}` 
            : null,
          verification_status_raw: m.verification_status,
          verification_status : 
                m.verification_status === 'VERIFIED'
                  ? `<div class="badge badge-success"><span>VERIFIED</span></div>` :
                m.verification_status === 'PENDING'
                  ? `<div class="badge badge-primary"><span>PENDING</span></div>` :
                m.verification_status === 'REJECTED'
                  ? `<div class="badge badge-danger"><span>REJECTED</span></div>` :
                  `<div class="badge badge-warning"><span>UNVERIFIED</span></div>`,
          
          src: this.KYCImage + m.document_url,
          caption: m.member?.first_name + ' ' + m.member?.last_name + ' - ' + m.id_type,
          thumb : this.KYCImage + m.document_url
        }));

        this.tableConfig.data = data ? mapped : [];
        this.tableConfig.total = data ? data?.length : 0;
      });
    
      this.submissions$.subscribe((room: any) => { 
        this._album = room.map((img: any) => ({
          src: this.KYCImage + img.document_url,
          caption: img.member?.first_name + ' ' + img.member?.last_name + ' - ' + img.id_type,
          thumb: this.KYCImage + img.document_url,
        }));
      })
  }

  closeLightbox(): void {
    this.lightbox.close();
  }
  openLightbox(imageData: any): void {
    
    const index = this._album.findIndex(x => x.src === imageData.src);

    if (index > -1) {
      this.lightbox.open(this._album, index);
    } else {
      console.warn('Image not found in album list:', imageData.image);
    }
  }
  ngAfterViewInit() {
    const docCol = this.tableConfig.columns.find(c => c.dataField === 'document_url');
    if (docCol) docCol.template = this.documentTemplate;
  }

  loadKYC() {
    this.store.dispatch(new GetKYCSubmissions({ role: 'admin' }));
  }


  onTableChange(data?: any) {
    this.store.dispatch(new GetKYCSubmissions(data));
  }

  onActionClicked(action: TableClickedAction) {
    const row = action.data;

    switch(action.actionToPerform) {
      case 'verify':
        this.verify(action.data);
        break;
      
      case 'reject':
        this.reject(action.data);
        break;

      case 'delete':
        this.delete(action.data);
        break;

      case 'view':
        if (isPlatformBrowser(this.platformId)) { 
          this.view(row.document_url);
        }  
        break;
    }
  }

  verify(data: any) {
    
    this.store.dispatch(new UpdateKYCStatus(data.id, { verification_status: 'VERIFIED', verified_by: this.currentUserId }))
    .pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (res: any) => {
          const response = res?.kyc?.response;
          if (response.status === appConfig.statusCode.ok) {
              this.notificationService.showSuccess(response.message);
          } else { 
            this.notificationService.showError(response.message);
          } 
          this.ngOnInit();
        },
        error: (err) => {
          this.notificationService.showError(err?.message || 'Failed to update room status');
        }
      });
  }

  delete(data: any) {
    this.store.dispatch(new DeleteKYC(data.id))
    .pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: any) => {
        const response = res?.kyc?.response; 
        if (response.status === appConfig.statusCode.ok) {
          this.notificationService.showSuccess(response.message);
          this.ngOnInit();
        }else { 
          this.notificationService.showError(response.message);
        }     
      },
      error: (err) => {
        this.notificationService.showError(err?.message || 'Failed to delete room!');
      }
    });
  }

  view(url: string) {
    window.open(this.KYCImage+url, '_blank');
  }

  reject(data: any) {
    console.log('dta;;',data);
    if (!data.rejection_reason.trim()) return;

    this.store.dispatch(new UpdateKYCStatus(data.id, {
      verification_status: 'REJECTED',
      rejected_by: this.currentUserId,
      rejection_reason: data.rejection_reason
    })).subscribe({
      next: (res: any) => {
        const response = res?.kyc?.response; 
        
        if (response.status === appConfig.statusCode.ok) {
          this.notificationService.showSuccess(response.message);
        }else { 
          this.notificationService.showError(response.message);
        }     
        this.ngOnInit();
        const modalEl = document.getElementById('rejectionModal');
        if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
        },
        error: (err) => {
          this.notificationService.showError(err?.message || 'Failed to reject document!');
        }
    
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  applyFilter(data: Select2UpdateEvent) {
    this.filter['status'] = data?.value || null;
    if (!this.filter['status']) delete this.filter['status'];
    this.onTableChange(this.filter);
  }

  filters(data: any, key: string) {
    this.filter[key] = data?.value || [];
    this.onTableChange(this.filter);
  }
}
