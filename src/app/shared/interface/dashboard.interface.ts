export interface StatisticsCount {
    // Cooperative fintech fields
    total_wallet_amount: number;
    total_savings_amount: number;
    total_credit_sales: number;
    total_loans: number;
    total_members: number;
    total_investment_pool: number;
    total_active_investors: number;
    total_invested_amount: number;
    total_pending_loans: number;
    total_approved_loans: number;
    total_disbursed_loans: number;
    total_loan_amount: number;
    // Legacy fields (used in order/withdrawal components — kept for compatibility)
    total_revenue?: number;
    total_orders?: number;
    total_users?: number;
    total_products?: number;
    total_stores?: number;
    total_refunds?: number;
    total_withdraw_requests?: number;
    total_withdrawals?: number;
    total_out_of_delivery_orders?: number;
    total_shipped_orders?: number;
    total_cancelled_orders?: number;
    total_processing_orders?: number;
    total_pending_orders?: number;
    total_delivered_orders?: number;
}

export interface RevenueChart {
    revenues: number[];
    commissions: number[];
    months: string[];
}
