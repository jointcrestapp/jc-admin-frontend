import {  Component,
  TemplateRef,
  ViewChild,
  Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../button/button.component';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-kyc-preview-modal',
  imports: [TranslateModule, ButtonComponent,CommonModule],
  templateUrl: './kyc-preview-modal.component.html',
  styleUrl: './kyc-preview-modal.component.scss',
  standalone:true
})
export class KycPreviewModalComponent {
    @ViewChild("kycPreviewModal", { static: false }) kycPreviewModal: TemplateRef<any>;

  imageUrl: string = '';
  zoom = 1;

  constructor(private modalService: NgbModal) {}

  openModal(url: string) {
    this.imageUrl = url;
    this.zoom = 1;

    this.modalService.open(this.kycPreviewModal, {
      size: 'lg',
      centered: true,
      windowClass: 'theme-modal kyc-preview-modal'
    });
  }

  zoomIn() {
    this.zoom += 0.2;
  }

  zoomOut() {
    if (this.zoom > 0.4) this.zoom -= 0.2;
  }
}
