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
export class DividendExcelService {
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private notification: NotificationService
  ) {}

  exportDividendToExcel(dividends: any[]): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error("Excel operations are browser-only"));
    }

    return from(import("xlsx")).pipe(
      map((XLSX) => {
        // Prepare the data for export
        const exportData = dividends.map((dividend, index) => {
          const baseData = {
            "S/N": index + 1,
            "Member ID": dividend.member_id || "N/A",
            "Full Name": dividend.full_name || "",
            "Savings Balance": dividend.savings_bal || "",
            "Savings Dividend": dividend.savings_dividend || "",
            Date: dividend.date
              ? new Date(dividend.date).toLocaleDateString()
              : "",
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
          { wch: 10 },
        ];

        // Add additional column widths based on member type
        let colWidths = [...baseColWidths];

        ws["!cols"] = colWidths;

        // Create workbook and add the worksheet
        const wb: XLSX.WorkBook = XLSX.utils.book_new();

        // Determine sheet name based on member type
        const sheetName = "All Dividend";
        XLSX.utils.book_append_sheet(wb, ws, sheetName);

        // Generate filename
        const currentDate = new Date().toISOString().split("T")[0];
        const filename = `dividends_export_${currentDate}.xlsx`;

        // Write the file
        XLSX.writeFile(wb, filename);
        return { success: true, filename };
      }),
      tap((result) =>
        this.notification.showSuccess(
          `Dividend History exported successfully as ${result.filename}`
        )
      ),
      catchError((error) => {
        this.notification.showError(
          `Failed to export Dividend History to Excel`
        );
        return throwError(() => error);
      })
    );
  }
}
