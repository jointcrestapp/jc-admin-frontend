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
export class UserExcelService {
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private notification: NotificationService
  ) {}

  exportAdminsToExcel(members: any[]): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error("Excel operations are browser-only"));
    }

    return from(import("xlsx")).pipe(
      map((XLSX) => {
        // Prepare the data for export
        const exportData = members.map((member, index) => {
          const baseData = {
            "S/N": index + 1,
            "Member ID": member.member_id || "N/A",
            "First Name": member.first_name || "",
            "Last Name": member.last_name || "",
            Email: member.email || "",
            Phone: member.phone || "",
            Role: member.role_name || "",
            Status: member.is_activated ? "Active" : "Inactive",
            "Date Created": member.createdAt
              ? new Date(member.createdAt).toLocaleDateString()
              : "",
            "Account Type":
              member.account_type == 3
                ? "Member"
                : member.account_type == 4
                ? "Agent"
                : "Admin",
          };
          return baseData;
        });

        // Create worksheet from the data
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

        // Set column widths for better readability
        const baseColWidths = [
          { wch: 5 },
          { wch: 15 },
          { wch: 15 },
          { wch: 15 },
          { wch: 25 },
          { wch: 15 },
          { wch: 10 },
          { wch: 10 },
          { wch: 15 },
          { wch: 15 },
        ];

        // Add additional column widths based on member type
        let colWidths = [...baseColWidths];
        ws["!cols"] = colWidths;

        // Create workbook and add the worksheet
        const wb: XLSX.WorkBook = XLSX.utils.book_new();

        // Determine sheet name based on member type
        const sheetName = "All Admins";
        XLSX.utils.book_append_sheet(wb, ws, sheetName);

        // Generate filename
        const currentDate = new Date().toISOString().split("T")[0];
        const filename = `admins_export_${currentDate}.xlsx`;

        // Write the file
        XLSX.writeFile(wb, filename);
        return { success: true, filename };
      }),
      tap((result) =>
        this.notification.showSuccess(
          `All Admins exported successfully as ${result.filename}`
        )
      ),
      catchError((error) => {
        this.notification.showError(`Failed to export All Admins to Excel`);
        return throwError(() => error);
      })
    );
  }
}
