import { Component, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../button/button.component';
import { TableClickedAction } from '../../../../interface/table.interface';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-approval-modal',
    imports: [TranslateModule, ButtonComponent],
    templateUrl: './approval-modal.component.html',
  styleUrl: './approval-modal.component.scss',
  standalone:true
})
export class ApprovalModalComponent {

  public closeResult: string;
  public modalOpen: boolean = false;
  public userAction: TableClickedAction;

  @ViewChild("approvalModal", { static: false }) ApprovalModal: TemplateRef<any>;

  @Output() confirmed: EventEmitter<TableClickedAction> = new EventEmitter();

  constructor(private modalService: NgbModal) { }

  async openModal(action: string, data?: any, value?: any) {
    this.modalOpen = true;
    this.userAction = {
      actionToPerform: action,
      data: data,
      value: value
    };
    this.modalService.open(this.ApprovalModal, {
      ariaLabelledBy: 'Approval-Modal',
      centered: true,
      windowClass: 'theme-modal text-center'
    }).result.then((result) => {
      `Result ${result}`
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: ModalDismissReasons): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  confirm() {
    this.confirmed.emit(this.userAction);
  }

  ngOnDestroy() {
    if (this.modalOpen) {
      this.modalService.dismissAll();
    }
  }
  
}
