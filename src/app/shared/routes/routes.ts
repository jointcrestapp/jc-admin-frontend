import { Routes } from "@angular/router";

export const content: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('../../pages/dashboard/dashboard.routes')
  },
  {
    path: 'account',
    loadChildren: () => import('../../pages/account/account.routes').then(r => r.accountRoutes)
  },
  {
    path: 'user',
    loadChildren: () => import('../../pages/user/user.routes').then(r => r.userRoutes)
  },
  {
    path: 'role',
    loadChildren: () => import('../../pages/role/role.routes').then(r => r.roleRoutes)
  },
  {
    path: 'product',
    loadChildren: () => import('../../components/product/product.routes').then(r => r.productRoutes)
  },
  {
    path: 'attribute',
    loadChildren: () => import('../../components/attribute/attribute.routes').then(r => r.attributeRoutes)
  },
  {
    path: 'category',
    loadChildren: () => import('../../components/category/category.routes').then(r => r.categoryRoutes)
  },
  {
    path: 'tag',
    loadChildren: () => import('../../components/tag/tag.routes').then(r => r.tagRoutes)
  },
  {
    path: 'brand',
    loadChildren: () => import('../../components/brand/brand.routes').then(r => r.brandRoutes)
  },
  {
    path: 'qna',
    loadChildren: () => import('../../components/questions-answers/questions-answers.routes').then(r => r.questionAnswersRoutes)
  },
  {
    path: 'license-key',
    loadChildren: () => import('../../components/license-key/license-key.routes').then(r => r.licenseKeyRoutes)
  },
  {
    path: 'savings',
    loadChildren: () => import('../../pages/savings/savings.routes').then(r => r.savingsRoutes)
  },
  {
    path: 'loan',
    loadChildren: () => import('../../pages/loan/loan.routes').then(r => r.loanRoutes)
  },
  {
    path: 'shares',
    loadChildren: () => import('../../components/shares/shares.routes').then(r => r.sharesRoutes)
  },
  {
    path: 'thrift',
    loadChildren: () => import('../../pages/thrift/thrift.routes').then(r => r.thriftRoutes)
  },
  {
    path: 'credit_sales',
    loadChildren: () => import('../../pages/credit-sales/credit-sales.routes').then(r => r.creditSalesRoutes)
  },
  {
    path: 'share_withdrawal',
    loadChildren: () => import('../../pages/share-withdrawal/share-withdrawal.routes').then(r => r.shareWithdrawalRoutes)
  },
  {
    path: 'dividend',
    loadChildren: () => import('../../pages/dividend/dividend.routes').then(r => r.dividendRoutes)
  },
  {
    path: 'wallet_transaction',
    loadChildren: () => import('../../pages/wallet-transaction/wallet-transaction.routes').then(r => r.walletTransactionRoutes)
  },
  {
    path: 'communication',
    loadChildren: () => import('../../pages/communication/communication.routes').then(r => r.communicationRoutes)
  },
  {
    path: 'reporting',
    loadChildren: () => import('../../pages/reporting/reporting.routes').then(r => r.reportingRoutes)
  },
  {
    path: 'investment',
    loadChildren: () => import('../../pages/investment/investment.routes').then(r => r.investmentRoutes)
  },
  {
    path: 'miscellaneous',
    loadChildren: () => import('../../pages/miscellaneous/miscellaneous.routes').then(r => r.miscellaneousRoutes)
  },
  {
    path: 'agent',
    loadChildren: () => import('../../pages/agent/agent.routes').then(r => r.agentRoutes)
  },
  {
    path: 'user_trail',
    loadChildren: () => import('../../pages/user-trails/user-trails.routes').then(r => r.userTrialsRoutes)
  },
  {
    path: 'store',
    loadChildren: () => import('../../components/store/store.routes').then(r => r.storeRoutes)
  },
  {
    path: 'wallet',
    loadChildren: () => import('../../components/wallet/wallet.routes').then(r => r.walletRoutes)
  },
  {
    path: 'commission',
    loadChildren: () => import('../../components/commission/commission.routes').then(r => r.commissionRoutes)
  },
  {
    path: 'withdrawal',
    loadChildren: () => import('../../pages/withdrawal/withdrawal.routes').then(r => r.withdrawalRoutes)
  },
  {
    path: 'payment-details',
    loadChildren: () => import('../../components/payout-details/payout-details.routes').then(r => r.payoutDetailsRoutes)
  },
  {
    path: 'order',
    loadChildren: () => import('../../components/order/order.routes').then(r => r.orderRoutes)
  },
  {
    path: 'media',
    loadChildren: () => import('../../components/media/media.routes').then(r => r.mediaRoutes)
  },
  {
    path: 'blog',
    loadChildren: () => import('../../components/blog/blog.routes').then(r => r.blogRoutes)
  },
  {
    path: 'page',
    loadChildren: () => import('../../components/page/page.routes').then(r => r.pageRoutes)
  },
  {
    path: 'tax',
    loadChildren: () => import('../../components/tax/tax.routes').then(r => r.taxRoutes)
  },
  {
    path: 'shipping',
    loadChildren: () => import('../../components/shipping/shipping.routes').then(r => r.shippingRoutes)
  },
  {
    path: 'coupon',
    loadChildren: () => import('../../components/coupon/coupon.routes').then(r => r.couponRoutes)
  },
  {
    path: 'currency',
    loadChildren: () => import('../../pages/currency/currency.routes').then(r => r.currencyRoutes)
  },
  {
    path: 'point',
    loadChildren: () => import('../../components/point/point.routes').then(r => r.pointRoutes)
  },
  {
    path: 'vendor-wallet',
    loadChildren: () => import('../../components/vendor-wallet/vendor-wallet.routes').then(r => r.vendorWalletRoutes)
  },
  {
    path: 'refund',
    loadChildren: () => import('../../components/refund/refund.routes').then(r => r.refundRoutes)
  },
  {
    path: 'review',
    loadChildren: () => import('../../components/review/review.routes').then(r => r.reviewRoutes)
  },
  {
    path: 'faq',
    loadChildren: () => import('../../components/faq/faq.routes').then(r => r.faqRoutes)
  },
  {
    path: 'notification',
    loadChildren: () => import('../../components/notification/notification.routes').then(r => r.notificationRoutes)
  },
  {
    path: 'notice',
    loadChildren: () => import('../../components/notice/notice.routes').then(r => r.noticeRoutes)
  },
  {
    path: 'subscription',
    loadChildren: () => import('../../pages/subscription/subscription.routes').then(r => r.subscriptionRoutes)
  },
  {
    path: 'theme',
    loadChildren: () => import('../../components/theme/theme.routes').then(r => r.themeRoutes)
  },
  {
    path: 'theme-option',
    loadChildren: () => import('../../components/theme-option/theme-option.routes').then(r => r.themeOptionRoutes)
  },
  {
    path: 'menu',
    loadChildren: () => import('../../components/menu/menu.routes').then(r => r.MenuRoutes)
  },
  {
    path: 'setting',
    loadChildren: () => import('../../pages/setting/setting.routes').then(r => r.SettingRoutes)
  },
]
