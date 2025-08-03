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
export class CreditExcelService {
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private notification: NotificationService
  ) {}

  exportCreditToExcel(
    credits: any[],
    creditType: string = "requested_credit_sales",
    customFilename?: string
  ): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error("Excel operations are browser-only"));
    }

    return from(import("xlsx")).pipe(
      map((XLSX) => {
        // Prepare the data for export
        const exportData = credits.map((credit, index) => {
          const baseData = {
            "S/N": index + 1,
            "Member ID": credit.member_id || "N/A",
            "Full Name": credit.full_name || "",
            Principal: credit.principal || "",
            "Total Due": credit.total_due || "",
            Interest: credit.interest || "",
            "Monthly Due": credit.monthly_due || "",
            Status:
              credit.status == 0
                ? "Requested"
                : credit.status == "1"
                ? "Approved"
                : credit.status == 2
                ? "Disbursed"
                : "Finished",
            Date: credit.date ? new Date(credit.date).toLocaleDateString() : "",
          };

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
          { wch: 20 },
          { wch: 5 },
          { wch: 20 },
          { wch: 20 },
          { wch: 20 },
        ];

        // Add additional column widths based on member type
        let colWidths = [...baseColWidths];

        ws["!cols"] = colWidths;

        // Create workbook and add the worksheet
        const wb: XLSX.WorkBook = XLSX.utils.book_new();

        // Determine sheet name based on member type
        const sheetName = this.getSheetName(creditType);
        XLSX.utils.book_append_sheet(wb, ws, sheetName);

        // Generate filename
        const currentDate = new Date().toISOString().split("T")[0];
        const filename =
          customFilename || `${creditType}_export_${currentDate}.xlsx`;

        // Write the file
        XLSX.writeFile(wb, filename);
        return { success: true, filename };
      }),
      tap((result) =>
        this.notification.showSuccess(
          `${this.getCreditTypeDisplayName(
            creditType
          )} exported successfully as ${result.filename}`
        )
      ),
      catchError((error) => {
        this.notification.showError(
          `Failed to export ${this.getCreditTypeDisplayName(
            creditType
          )} to Excel`
        );
        return throwError(() => error);
      })
    );
  }

  private getSheetName(creditType: string): string {
    const sheetNames: { [key: string]: string } = {
      requested_credit_sales: "Requested Credit Sales",
      approved_credit_sales: "Approved Credit Sales",
      disbursed_credit_sales: "Disbursed Credit Sales",
      finished_credit_sales: "Finished Credit Sales",
      ordered_products: "Ordered Products",
      repayments: "Repayments",
      credits: "Credits",
    };
    return sheetNames[creditType] || "Credits";
  }

  private getCreditTypeDisplayName(creditType: string): string {
    const displayNames: { [key: string]: string } = {
      requested_credit_sales: "Requested Credit Sales",
      approved_credit_sales: "Approved Credit Sales",
      disbursed_credit_sales: "Disbursed Credit Sales",
      finished_credit_sales: "Finished Credit Sales",
      ordered_products: "Ordered Products",
      repayments: "Repayments",
      credits: "Credits",
    };
    return displayNames[creditType] || "Credits";
  }
}
