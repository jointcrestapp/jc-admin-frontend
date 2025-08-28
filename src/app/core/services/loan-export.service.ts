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
export class LoanExcelService {
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private notification: NotificationService
  ) {}

  exportLoansToExcel(
    loans: any[],
    loanType: string = "requested_loans",
    customFilename?: string
  ): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error("Excel operations are browser-only"));
    }

    console.log("Loans >>>>>>>>>>>>>>", loans);

    return from(import("xlsx")).pipe(
      map((XLSX) => {
        // Prepare the data for export
        const exportData = loans.map((loan, index) => {
          const baseData = {
            "S/N": index + 1,
            "Member ID": loan.member_id || "N/A",
            "Full Name": loan.full_name || "",
            "Loan Type": loan.loan_type || "",
            Date: loan.date ? new Date(loan.date).toLocaleDateString() : "",
          };

          // Add additional fields based on member type
          if (loanType === "loan_repayment") {
            return {
              ...baseData,
              "Amount Paid": loan.amount_paid || "",
              "Amount Remain": loan.due_amount || "",
            };
          }

          if (
            loanType === "requested_loans" ||
            loanType === "approved_loans" ||
            loanType === "disbursed_loans" ||
            loanType === "finished_loans" ||
            loanType === "due_loans_repayment" ||
            loanType === "custom_selection"
          ) {
            return {
              ...baseData,
              Principal: loan.amount || "",
              "Total Due": loan.total_due || "",
              Interest: loan.interest || "",
              "Monthly Due": loan.monthly_due || "",
              Status:
                loan.status == 0
                  ? "Requested"
                  : loan.status == "1"
                  ? "Approved"
                  : loan.status == 2
                  ? "Disbursed"
                  : "Finished",
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
          { wch: 20 },
        ];

        // Add additional column widths based on member type
        let colWidths = [...baseColWidths];
        if (loanType === "loan_repayment") {
          colWidths.push({ wch: 20 }, { wch: 20 });
        } else if (
          loanType === "requested_loans" ||
          loanType === "approved_loans" ||
          loanType === "disbursed_loans" ||
          loanType === "finished_loans" ||
          loanType === "due_loans_repayment" ||
          loanType === "custom_selection"
        ) {
          colWidths.push(
            { wch: 15 },
            { wch: 20 },
            { wch: 5 },
            { wch: 20 },
            { wch: 20 }
          );
        }

        ws["!cols"] = colWidths;

        // Create workbook and add the worksheet
        const wb: XLSX.WorkBook = XLSX.utils.book_new();

        // Determine sheet name based on member type
        const sheetName = this.getSheetName(loanType);
        XLSX.utils.book_append_sheet(wb, ws, sheetName);

        // Generate filename
        const currentDate = new Date().toISOString().split("T")[0];
        const filename =
          customFilename || `${loanType}_export_${currentDate}.xlsx`;

        // Write the file
        XLSX.writeFile(wb, filename);
        return { success: true, filename };
      }),
      tap((result) =>
        this.notification.showSuccess(
          `${this.getLoanTypeDisplayName(loanType)} exported successfully as ${
            result.filename
          }`
        )
      ),
      catchError((error) => {
        this.notification.showError(
          `Failed to export ${this.getLoanTypeDisplayName(loanType)} to Excel`
        );
        return throwError(() => error);
      })
    );
  }

  private getSheetName(loanType: string): string {
    const sheetNames: { [key: string]: string } = {
      requested_loans: "Requested Loans",
      approved_loans: "Approved Loans",
      disbursed_loans: "Disbursed Loans",
      finished_loans: "Finished Loans",
      loan_repayment: "Loan Repayment",
      due_loans_repayment: "Due Loan Repayment",
      loans: "Loans",
    };
    return sheetNames[loanType] || "Loans";
  }

  private getLoanTypeDisplayName(loanType: string): string {
    const displayNames: { [key: string]: string } = {
      requested_loans: "Requested Loans",
      approved_loans: "Approved Loans",
      disbursed_loans: "Disbursed Loans",
      finished_loans: "Finished Loans",
      loan_repayment: "Loan Repayment",
      due_loans_repayment: "Due Loan Repayment",
      loans: "Loans",
    };
    return displayNames[loanType] || "Loans";
  }
}
