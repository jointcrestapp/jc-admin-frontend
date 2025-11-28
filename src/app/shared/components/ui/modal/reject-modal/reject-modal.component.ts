import { Component, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../button/button.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reject-modal',
  standalone: true,
  templateUrl: './reject-modal.component.html',
  styleUrl: './reject-modal.component.scss',
  imports: [TranslateModule,CommonModule,FormsModule, ButtonComponent]
})
export class RejectModalComponent {

  @ViewChild("rejectModal", { static: false }) RejectModal!: TemplateRef<any>;

  @Output() submitted = new EventEmitter<{ action: string; data: any; reason: string }>();

  public reason = '';
  public action: string;
  public data: any;

  constructor(private modalService: NgbModal) {}

  openModal(action: string, data: any) {
    this.action = action;
    this.data = data;
    this.reason = '';

    this.modalService.open(this.RejectModal, {
      ariaLabelledBy: 'Reject-Modal',
      centered: true,
      windowClass: 'theme-modal text-center'
    });
  }

  submit() {
    this.submitted.emit({
      action: this.action,
      data: this.data,
      reason: this.reason
    });
  }
}
