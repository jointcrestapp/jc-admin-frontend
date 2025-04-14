
import { Routes } from '@angular/router';
import { BroadcastComponent } from './broadcast/broadcast.component';
import { SmsReportComponent } from './sms-report/sms-report.component';



export const communicationRoutes: Routes = [
  {
    path: 'broadcast',
    component: BroadcastComponent
  },
  {
    path: 'sms-report',
    component: SmsReportComponent
  }
];
