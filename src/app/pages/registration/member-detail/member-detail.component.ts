import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { MemberState } from "../../../shared/store/state/member.state";
import { mapMemberProfileResponse } from 'src/app/core/helpers/member-mapper';
import { PageWrapperComponent } from 'src/app/shared/components/page-wrapper/page-wrapper.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { GetMembers, UpdateMemberStatus } from 'src/app/shared/store/action/member.action';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { appConfig } from 'src/app/core/config/config';


@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.scss',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, PageWrapperComponent],
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private store = inject(Store);
  private notify = inject(NotificationService);
  private destroy$ = new Subject<void>();

  member$: Observable<any>;
  isUpdating = false;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    // Ensure members data is loaded
    const current = this.store.selectSnapshot(MemberState.member);
    if (!current?.data?.length) {
      this.store.dispatch(new GetMembers({ role: 'member' }));
    }

    this.member$ = this.store.select(MemberState.member).pipe(
      map(result => {
        const raw = result?.data?.find((m: any) => m.id == id);
        return raw ? mapMemberProfileResponse(raw) : null;
      })
    );
  }

  toggleActivation(user: any) {
    const newStatus = user.isActivated ? 0 : 1;
    const action = user.isActivated ? 'deactivated' : 'activated';
    this.isUpdating = true;

    this.store.dispatch(new UpdateMemberStatus(user.id, newStatus as any))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          const response = res?.member?.response;
          if (response?.status === appConfig.statusCode.ok) {
            this.notify.showSuccess(`Member ${action} successfully`);
          } else {
            this.notify.showError(response?.message || `Failed to ${action} member`);
          }
          this.isUpdating = false;
        },
        error: (err) => {
          this.notify.showError(err?.message || `Failed to update member status`);
          this.isUpdating = false;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
