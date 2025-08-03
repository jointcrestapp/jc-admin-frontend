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
export class SavingsExcelService {
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private notification: NotificationService
  ) {}

  exportSavingsToExcel(savings: any[]): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error("Excel operations are browser-only"));
    }

    return from(import("xlsx")).pipe(
      map((XLSX) => {
        // Prepare the data for export
        const exportData = savings.map((saving, index) => ({
          "S/N": index + 1,
          "Member ID": saving.member_id || "N/A",
          "Full Name": saving.full_name || "",
          Amount: saving.amount || "",
          "Savings Type": saving.savings_type || "",
          Narration: saving.narration || "",
          Month: saving.month || "",
          Year: saving.year || "",
          Country: saving.user_country || "",
          "Date Created": saving.date
            ? new Date(saving.date).toLocaleDateString()
            : "",
        }));

        // Create worksheet from the data
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

        // Set column widths for better readability
        const colWidths = [
          { wch: 5 }, // S/N
          { wch: 15 }, // Member ID
          { wch: 30 }, // Full Name
          { wch: 10 }, // Amount
          { wch: 15 }, // Savings Type
          { wch: 40 }, // Narration
          { wch: 10 }, // Month
          { wch: 10 }, // Year
          { wch: 10 }, // Country
          { wch: 15 }, // Date
        ];
        ws["!cols"] = colWidths;

        // Create workbook and add the worksheet
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Savings");

        // Generate filename with current date
        const currentDate = new Date().toISOString().split("T")[0];
        const filename = `savings_export_${currentDate}.xlsx`;

        // Write the file
        XLSX.writeFile(wb, filename);
        return { success: true, filename };
      }),
      tap((result) =>
        this.notification.showSuccess(
          `Savings exported successfully as ${result.filename}`
        )
      ),
      catchError((error) => {
        this.notification.showError("Failed to export savings to Excel");
        return throwError(() => error);
      })
    );
  }
}
