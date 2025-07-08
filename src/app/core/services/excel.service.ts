import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { NotificationService } from "src/app/shared/services/notification.service";
import {
  Observable,
  defer,
  from,
  tap,
  catchError,
  throwError,
  map,
} from "rxjs";
import * as XLSX from "xlsx";

@Injectable({ providedIn: "root" })
export class ExcelService {
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private notification: NotificationService
  ) {}

  generateSavingsTemplate(): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error("Excel operations are browser-only"));
    }

    return from(import("xlsx")).pipe(
      map((XLSX) => {
        const template = [["member_id", "amount"]];

        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(template);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Savings Template");
        XLSX.writeFile(wb, "savings_template.xlsx");
        return true;
      }),
      tap(() =>
        this.notification.showSuccess("Template downloaded successfully")
      ),
      catchError((error) => {
        this.notification.showError("Failed to generate template");
        return throwError(() => error);
      })
    );
  }

  generateLoanTemplate(): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error("Excel operations are browser-only"));
    }

    return from(import("xlsx")).pipe(
      map((XLSX) => {
        const template = [["member_id", "amount"]];

        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(template);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Loan Template");
        XLSX.writeFile(wb, "loan_template.xlsx");
        return true;
      }),
      tap(() =>
        this.notification.showSuccess("Template downloaded successfully")
      ),
      catchError((error) => {
        this.notification.showError("Failed to generate template");
        return throwError(() => error);
      })
    );
  }

  generateSharesTemplate(): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error("Excel operations are browser-only"));
    }

    return from(import("xlsx")).pipe(
      map((XLSX) => {
        const template = [["member_id", "amount"]];

        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(template);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Shares Template");
        XLSX.writeFile(wb, "shares_template.xlsx");
        return true;
      }),
      tap(() =>
        this.notification.showSuccess("Template downloaded successfully")
      ),
      catchError((error) => {
        this.notification.showError("Failed to generate template");
        return throwError(() => error);
      })
    );
  }

  generateThriftsTemplate(): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error("Excel operations are browser-only"));
    }

    return from(import("xlsx")).pipe(
      map((XLSX) => {
        const template = [["member_id", "amount"]];

        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(template);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Thrifts Template");
        XLSX.writeFile(wb, "thrifts_template.xlsx");
        return true;
      }),
      tap(() =>
        this.notification.showSuccess("Template downloaded successfully")
      ),
      catchError((error) => {
        this.notification.showError("Failed to generate template");
        return throwError(() => error);
      })
    );
  }
}
