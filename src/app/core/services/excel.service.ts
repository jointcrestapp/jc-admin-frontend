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
  switchMap,
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

  exportMembersToExcel(
    members: any[],
    memberType: string = "members",
    customFilename?: string
  ): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error("Excel operations are browser-only"));
    }

    return from(import("xlsx")).pipe(
      switchMap((XLSX) => {
        return new Observable<any>((subscriber) => {
          try {
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

              if (memberType === "account_closure_request") {
                return {
                  ...baseData,
                  "Request Date": member.request_date
                    ? new Date(member.request_date).toLocaleDateString()
                    : "",
                  Reason: member.closure_reason || "",
                  "Request Status": member.request_status || "Pending",
                };
              }

              if (memberType === "exited_members") {
                return {
                  ...baseData,
                  "Exit Date": member.exit_date
                    ? new Date(member.exit_date).toLocaleDateString()
                    : "",
                  "Exit Reason": member.exit_reason || "",
                };
              }

              return baseData;
            });

            // Create worksheet
            const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

            // Set column widths
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

            let colWidths = [...baseColWidths];
            if (memberType === "account_closure_request") {
              colWidths.push({ wch: 15 }, { wch: 20 }, { wch: 15 });
            } else if (memberType === "exited_members") {
              colWidths.push({ wch: 15 }, { wch: 20 });
            }
            ws["!cols"] = colWidths;

            // Create workbook
            const wb: XLSX.WorkBook = XLSX.utils.book_new();
            const sheetName = this.getSheetName(memberType);
            XLSX.utils.book_append_sheet(wb, ws, sheetName);

            // Generate filename
            const currentDate = new Date().toISOString().split("T")[0];
            const filename =
              customFilename || `${memberType}_export_${currentDate}.xlsx`;

            // Use setTimeout to ensure browser has time to process the download
            setTimeout(() => {
              try {
                XLSX.writeFile(wb, filename);
                subscriber.next({ success: true, filename });
                subscriber.complete();
              } catch (error) {
                subscriber.error(error);
              }
            }, 100);
          } catch (error) {
            subscriber.error(error);
          }
        });
      }),
      tap((result) => {
        this.notification.showSuccess(
          `${this.getMemberTypeDisplayName(
            memberType
          )} exported successfully as ${result.filename}`
        );
      }),
      catchError((error) => {
        this.notification.showError(
          `Failed to export ${this.getMemberTypeDisplayName(
            memberType
          )} to Excel`
        );
        return throwError(() => error);
      })
    );
  }

  // exportMembersToExcel(
  //   members: any[],
  //   memberType: string = "members",
  //   customFilename?: string
  // ): Observable<any> {
  //   if (!isPlatformBrowser(this.platformId)) {
  //     return throwError(() => new Error("Excel operations are browser-only"));
  //   }

  //   return from(import("xlsx")).pipe(
  //     map((XLSX) => {
  //       // Prepare the data for export
  //       const exportData = members.map((member, index) => {
  //         const baseData = {
  //           "S/N": index + 1,
  //           "Member ID": member.member_id || "N/A",
  //           "First Name": member.first_name || "",
  //           "Last Name": member.last_name || "",
  //           Email: member.email || "",
  //           Phone: member.phone || "",
  //           Role: member.role_name || "",
  //           Status: member.is_activated ? "Active" : "Inactive",
  //           "Date Created": member.createdAt
  //             ? new Date(member.createdAt).toLocaleDateString()
  //             : "",
  //           "Account Type":
  //             member.account_type == 3
  //               ? "Member"
  //               : member.account_type == 4
  //               ? "Agent"
  //               : "Admin",
  //         };

  //         // Add additional fields based on member type
  //         if (memberType === "account_closure_request") {
  //           return {
  //             ...baseData,
  //             "Request Date": member.request_date
  //               ? new Date(member.request_date).toLocaleDateString()
  //               : "",
  //             Reason: member.closure_reason || "",
  //             "Request Status": member.request_status || "Pending",
  //           };
  //         }

  //         if (memberType === "exited_members") {
  //           return {
  //             ...baseData,
  //             "Exit Date": member.exit_date
  //               ? new Date(member.exit_date).toLocaleDateString()
  //               : "",
  //             "Exit Reason": member.exit_reason || "",
  //           };
  //         }

  //         return baseData;
  //       });

  //       // Create worksheet from the data
  //       const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

  //       // Set column widths for better readability
  //       const baseColWidths = [
  //         { wch: 5 },
  //         { wch: 15 },
  //         { wch: 15 },
  //         { wch: 15 },
  //         { wch: 25 },
  //         { wch: 15 },
  //         { wch: 10 },
  //         { wch: 10 },
  //         { wch: 15 },
  //         { wch: 15 },
  //       ];

  //       // Add additional column widths based on member type
  //       let colWidths = [...baseColWidths];
  //       if (memberType === "account_closure_request") {
  //         colWidths.push({ wch: 15 }, { wch: 20 }, { wch: 15 });
  //       } else if (memberType === "exited_members") {
  //         colWidths.push({ wch: 15 }, { wch: 20 });
  //       }

  //       ws["!cols"] = colWidths;

  //       // Create workbook and add the worksheet
  //       const wb: XLSX.WorkBook = XLSX.utils.book_new();

  //       // Determine sheet name based on member type
  //       const sheetName = this.getSheetName(memberType);
  //       XLSX.utils.book_append_sheet(wb, ws, sheetName);

  //       // Generate filename
  //       const currentDate = new Date().toISOString().split("T")[0];
  //       const filename =
  //         customFilename || `${memberType}_export_${currentDate}.xlsx`;

  //       // Write the file
  //       XLSX.writeFile(wb, filename);
  //       return { success: true, filename };
  //     }),
  //     tap((result) =>
  //       this.notification.showSuccess(
  //         `${this.getMemberTypeDisplayName(
  //           memberType
  //         )} exported successfully as ${result.filename}`
  //       )
  //     ),
  //     catchError((error) => {
  //       this.notification.showError(
  //         `Failed to export ${this.getMemberTypeDisplayName(
  //           memberType
  //         )} to Excel`
  //       );
  //       return throwError(() => error);
  //     })
  //   );
  // }

  private getSheetName(memberType: string): string {
    const sheetNames: { [key: string]: string } = {
      all_members: "All Members",
      pending_members: "Pending Members",
      exited_members: "Exited Members",
      account_closure_request: "Account Closure Requests",
      agents: "Agents",
      members: "Members",
    };
    return sheetNames[memberType] || "Members";
  }

  private getMemberTypeDisplayName(memberType: string): string {
    const displayNames: { [key: string]: string } = {
      all_members: "all members",
      pending_members: "pending members",
      exited_members: "exited members",
      account_closure_request: "account closure requests",
      agents: "agents",
      members: "members",
    };
    return displayNames[memberType] || "members";
  }
}
