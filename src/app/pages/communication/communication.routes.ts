
import { Routes } from '@angular/router';
import { BroadcastComponent } from './broadcast/broadcast.component';
import { SmsReportComponent } from './sms-report/sms-report.component';



export const communicationRoutes: Routes = [
  {
    path: '',
    component: BroadcastComponent
  },
  {
    path: 'sms_report',
    component: SmsReportComponent
  }
];
