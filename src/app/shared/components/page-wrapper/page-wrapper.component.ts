import { Component, inject, Input } from '@angular/core';
import { Location, CommonModule } from '@angular/common'; // Import Location
import { Store } from '@ngxs/store';
import { LoaderState } from '../../store/state/loader.state';
import { Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { LoaderComponent } from '../loader/loader.component';

@Component({
    selector: 'app-page-wrapper',
    imports: [CommonModule, TranslateModule, LoaderComponent],
    templateUrl: './page-wrapper.component.html',
    styleUrl: './page-wrapper.component.scss',
    standalone: true
})
export class PageWrapperComponent {
  private location = inject(Location); // Inject Location service

  @Input() title: string;
  @Input() grid: boolean = true;
  @Input() gridClass: string = 'col-xxl-8 col-xl-10 m-auto';
  @Input() backButton: boolean = true;

  loadingStatus$: Observable<boolean> = inject(Store).select(LoaderState.status) as Observable<boolean>;

  goBack() {
    this.location.back();
  }
}