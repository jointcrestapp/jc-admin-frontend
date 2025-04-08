import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalState = new BehaviorSubject<boolean>(false);
  isModalOpen$ = this.modalState.asObservable();

  updateModalState(isOpen: boolean) {
    this.modalState.next(isOpen);
  }
}
