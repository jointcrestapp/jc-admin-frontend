import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { map, Observable } from 'rxjs';
import { MemberState } from "../../../shared/store/state/member.state";
import { mapMemberProfileResponse } from 'src/app/core/helpers/member-mapper';
import { PageWrapperComponent } from 'src/app/shared/components/page-wrapper/page-wrapper.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.scss',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, PageWrapperComponent],
})
export class MemberDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private store = inject(Store);
  
  member$: Observable<any>;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.member$ = this.store.select(MemberState.member).pipe(
      map(result => {
        const raw = result?.data?.find((m: any) => m.id == id);
        return raw ? mapMemberProfileResponse(raw) : null;
      })
    );
  }
}