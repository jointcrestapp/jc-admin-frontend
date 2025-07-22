import { Component } from "@angular/core";
import { PageWrapperComponent } from "src/app/shared/components/page-wrapper/page-wrapper.component";
import { FormNotificationComponent } from "../form-notification/form-notification.component";

@Component({
  selector: "app-notification",
  imports: [PageWrapperComponent, FormNotificationComponent],
  templateUrl: "./notification.component.html",
  styleUrl: "./notification.component.scss",
})
export class NotificationComponent {}
