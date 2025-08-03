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
export class ThriftsExcelService {
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private notification: NotificationService
  ) {}

  exportThriftsToExcel(thrifts: any[]): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error("Excel operations are browser-only"));
    }

    return from(import("xlsx")).pipe(
      map((XLSX) => {
        // Prepare the data for export
        const exportData = thrifts.map((thrift, index) => {
          const baseData = {
            "S/N": index + 1,
            "Member ID": thrift.member_id || "N/A",
            "Full Name": thrift.full_name || "",
            Amount: thrift.amount || "",
            "Thrift Tier": thrift.tier_type || "",
            "Thrift Category": thrift.tier_category || "",
            Duration: thrift.duration || "",
            Month: thrift.month || "",
            Year: thrift.year || "",
            Country: thrift.user_country || "",
            Date: thrift.date ? new Date(thrift.date).toLocaleDateString() : "",
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
          { wch: 30 },
          { wch: 10 },
          { wch: 10 },
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
        const sheetName = "All Thrifts";
        XLSX.utils.book_append_sheet(wb, ws, sheetName);

        // Generate filename
        const currentDate = new Date().toISOString().split("T")[0];
        const filename = `thrifts_export_${currentDate}.xlsx`;

        // Write the file
        XLSX.writeFile(wb, filename);
        return { success: true, filename };
      }),
      tap((result) =>
        this.notification.showSuccess(
          `Thrifts exported successfully as ${result.filename}`
        )
      ),
      catchError((error) => {
        this.notification.showError(`Failed to export thrifts to Excel`);
        return throwError(() => error);
      })
    );
  }
}
