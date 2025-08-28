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
import * as XLSX from 'xlsx';

@Injectable({ providedIn: "root" })
export class ReportExcelService {
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private notification: NotificationService
  ) {}

  exportReportsToExcel(
    reports: any[],
    reportType: string = "savings_report",
    customFilename?: string
  ): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error("Excel operations are browser-only"));
    }

    return from(import("xlsx")).pipe(
      map((XLSX) => {
        // Prepare the data for export
        const exportData = reports.map((report, index) => {
          let baseData = {};

          // Add additional fields based on member type
          if (
            reportType === "savings_report" ||
            reportType === "shares_report"
          ) {
            baseData = {
              "S/N": index + 1,
              Credit: report.credit || "",
              Debit: report.debit || "",
              Balance: report.balance || "",
            };
          }

          if (
            reportType === "loan_report" ||
            reportType === "credit_sales_report"
          ) {
            baseData = {
              "S/N": index + 1,
              Status:
                report.status == 0
                  ? "Requested"
                  : report.status == "1"
                  ? "Approved"
                  : report.status == 2
                  ? "Disbursed"
                  : "Finished",
              Principal: report.total_principal || "",
              Interest: report.total_interest || "",
              Total: report.total_balance || "",
              "Principal Monthly": report.principal_monthly || "",
              "Interest Monthly": report.interest_monthly || "",
              "Total Monthly": report.total_monthly || "",
              "Principal Balance": report.principal_balance || "",
              "Total Balance": report.total_balance || "",
            };
          }

          if (reportType === "ledger_balance_report") {
            baseData = {
              "S/N": index + 1,
              "Member ID": report.member_id || "N/A",
              Phone: report.phone || "",
              "Full Name": report.full_name || "",
              Savings: report.savings_bal || "",
              Loan: report.loan_bal || "",
              "Credit Sales": report.credit_sales_bal || "",
            };
          }

          return baseData;
        });

        // Create worksheet from the data
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

        // Set column widths for better readability
        const baseColWidths = [
          { wch: 5 },
          { wch: 15 },
          { wch: 30 },
          { wch: 15 },
        ];

        // Add additional column widths based on member type
        let colWidths = [...baseColWidths];
        if (
          reportType === "loan_report" ||
          reportType === "credit_sales_report"
        ) {
          colWidths.push(
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 }
          );
        } else if (reportType === "ledger_balance_report") {
          colWidths.push({ wch: 10 }, { wch: 10 }, { wch: 10 });
        }

        ws["!cols"] = colWidths;

        // Create workbook and add the worksheet
        const wb: XLSX.WorkBook = XLSX.utils.book_new();

        // Determine sheet name based on member type
        const sheetName = this.getSheetName(reportType);
        XLSX.utils.book_append_sheet(wb, ws, sheetName);

        // Generate filename
        const currentDate = new Date().toISOString().split("T")[0];
        const filename =
          customFilename || `${reportType}_export_${currentDate}.xlsx`;

        // Write the file
        XLSX.writeFile(wb, filename);
        return { success: true, filename };
      }),
      tap((result) =>
        this.notification.showSuccess(
          `${this.getReportTypeDisplayName(
            reportType
          )} exported successfully as ${result.filename}`
        )
      ),
      catchError((error) => {
        this.notification.showError(
          `Failed to export ${this.getReportTypeDisplayName(
            reportType
          )} to Excel`
        );
        return throwError(() => error);
      })
    );
  }

  private getSheetName(reportType: string): string {
    const sheetNames: { [key: string]: string } = {
      savings_report: "Savings Report",
      shares_report: "Shaers Report",
      loan_report: "Loan Report",
      credit_sales_report: "Credit Sales Report",
      ledger_balance_repeort: "Ledger Balance Report",
      reports: "Reports",
    };
    return sheetNames[reportType] || "Reports";
  }

  private getReportTypeDisplayName(reportType: string): string {
    const displayNames: { [key: string]: string } = {
      savings_report: "savings report",
      shares_report: "shaers report",
      loan_report: "loan report",
      credit_sales_report: "credit sales report",
      ledger_balance_repeort: "ledger balance report",
      reports: "reports",
    };
    return displayNames[reportType] || "Reports";
  }
}
