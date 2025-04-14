import { Sidebar } from "../interface/sidebar.interface";

export const menu: Sidebar[] = [
    {
      id: 1,
      title: "dashboard",
      path: "/dashboard",
      active: false,
      icon: "ri-home-line",
      type: "sub",
      level: 1
    },
    {
      id: 2,
      title: "registration",
      active: false,
      icon: "ri-contacts-line",
      type: "sub",
      level: 1,
      acl_permission: ["user.index", "user.create", "role.index"],
      children: [
        {
          parent_id: 2,
          title: "add member",
          path: "/user/create",
          type: "link",
          level: 2,
          permission: ["user.index", "user.create"],
        },
        {
          parent_id: 2,
          title: "all members",
          path: "/user",
          type: "link",
          level: 2,
          permission: ["user.index"],
        },
        {
          parent_id: 2,
          title: "pending members",
          path: "/user/pending-members",
          type: "link",
          level: 2,
          permission: ["user.index"],
        },
        {
          parent_id: 2,
          title: "account closure",
          path: "/user/account-closure-request",
          type: "link",
          level: 2,
          permission: ["user.index"],
        },
        {
          parent_id: 2,
          title: "exited members",
          path: "/user/exited-members",
          type: "link",
          level: 2,
          permission: ["user.index"],
        },
        {
          parent_id: 2,
          title: "role",
          path: "/role",
          type: "link",
          level: 2,
          permission: ["role.index"],
        }
      ],
    },
    {
      id: 19,
      title: "subscription",
      path: "/subscription",
      active: false,
      icon: "ri-settings-3-line",
      type: "sub",
      level: 1,
      permission: ["subscribe.index"]
    },
    {
      id: 22,
      title: "savings",
      active: false,
      icon: "ri-bank-line",
      type: "sub",
      level: 1,
      acl_permission: ["savings.index", "savings.create", "savings.edit"],
      children: [
        {
          parent_id: 22,
          title: "all savings",
          path: "/savings",
          type: "link",
          level: 2,
          permission: ["savings.index", "savings.create"]
        },
        {
          parent_id: 22,
          title: "add single savings",
          path: "/savings/add-single-savings",
          type: "link",
          badgeType: 'badge bg-theme text-dark ml-3', 
          badgeValue: 0,
          level: 2,
          permission: ["savings.create"]
        },
        {
          parent_id: 22,
          title: "add batch savings",
          path: "/savings/add-batch-savings",
          type: "link",
          level: 2,
          permission: ["savings.create"]
        }
      ],
    },
    {
      id: 23,
      title: "loan",
      active: false,
      icon: "ri-exchange-funds-line",
      type: "sub",
      level: 1,
      acl_permission: ["loan.index", "loan.create", "loan.edit"],
      children: [
        {
          parent_id: 23,
          title: "add_single_loan",
          path: "/loan/add-single-loan",
          type: "link",
          level: 2,
          permission: ["loan.index", "loan.create"]
        },
        {
          parent_id: 23,
          title: "requested loans",
          path: "/loan/requested-loans",
          type: "link",
          badgeType: 'badge bg-theme text-dark ml-3', 
          badgeValue: 0,
          level: 2,
          permission: ["loan.index"]
        },
        {
          parent_id: 23,
          title: "approved loans",
          path: "/loan/approved-loans",
          type: "link",
          level: 2,
          permission: ["loan.index"]
        },
        {
          parent_id: 23,
          title: "disbursed loans",
          path: "/loan/disbursed-loans",
          type: "link",
          level: 2,
          permission: ["loan.index"]
        },
        {
          parent_id: 23,
          title: "finished loans",
          path: "/loan/finished-loans",
          type: "link",
          level: 2,
          permission: ["loan.index"]
        },
        {
          parent_id: 23,
          title: "loan repayment",
          path: "/loan/loan-repayment",
          type: "link",
          level: 2,
          permission: ["loan.index"]
        },
        {
          parent_id: 23,
          title: "dual_loan_repayment",
          path: "/loan/dual-loan-repayment",
          type: "link",
          level: 2,
          permission: ["loan.create"]
        },
        {
          parent_id: 23,
          title: "add_batch_payment",
          path: "/loan/add-batch-repayment",
          type: "link",
          level: 2,
          permission: ["loan.create"]
        }
      ],
    },
    {
      id: 24,
      title: "shares",
      active: false,
      icon: "ri-stock-line",
      type: "sub",
      level: 1,
      acl_permission: ["shares.index", "shares.create", "shares.edit"],
      children: [
        {
          parent_id: 24,
          title: "all shares",
          path: "/shares",
          type: "link",
          level: 2,
          permission: ["shares.index", "shares.create"]
        },
        {
          parent_id: 24,
          title: "add_single_share",
          path: "/shares/add-single-share",
          type: "link",
          badgeType: 'badge bg-theme text-dark ml-3', 
          badgeValue: 0,
          level: 2,
          permission: ["shares.index", "shares.create"]
        },
        {
          parent_id: 24,
          title: "add_batch_shares",
          path: "/shares/add-batch-shares",
          type: "link",
          level: 2,
          permission: ["shares.create"]
        }
      ],
    },
    {
      id: 25,
      title: "thrift",
      active: false,
      icon: "ri-stock-line",
      type: "sub",
      level: 1,
      acl_permission: ["thrift.index", "thrift.create", "thrift.edit"],
      children: [
        {
          parent_id: 25,
          title: "all thrifts",
          path: "/thrift",
          type: "link",
          level: 2,
          permission: ["thrift.index", "thrift.create"]
        },
        {
          parent_id: 25,
          title: "thrift tiers",
          path: "/thrift/thrift-tiers",
          type: "link",
          badgeType: 'badge bg-theme text-dark ml-3', 
          badgeValue: 0,
          level: 2,
          permission: ["thrift.create"]
        },
        {
          parent_id: 25,
          title: "thrift category",
          path: "/thrift/thrift-category",
          type: "link",
          level: 2,
          permission: ["thrift.create"]
        }
      ],
    },
    {
      id: 26,
      title: "credit sales",
      active: false,
      icon: "ri-exchange-dollar-line",
      type: "sub",
      level: 1,
      acl_permission: ["credit.index", "credit.create", "credit.edit"],
      children: [
        {
          parent_id: 26,
          title: "order credit sales",
          path: "/credit-sales/order-credit-sales",
          type: "link",
          level: 2,
          permission: ["credit.index", "credit.create"]
        },
        {
          parent_id: 26,
          title: "requested credit sales",
          path: "/credit-sales/requested-credit-sales",
          type: "link",
          badgeType: 'badge bg-theme text-dark ml-3', 
          badgeValue: 0,
          level: 2,
          permission: ["credit.index"]
        },
        {
          parent_id: 26,
          title: "approved credit sales",
          path: "/credit-sales/approved-credit-sales",
          type: "link",
          level: 2,
          permission: ["credit.index"]
        },
        {
          parent_id: 26,
          title: "dispatched credit sales",
          path: "/credit-sales/dispatched-credit-sales",
          type: "link",
          level: 2,
          permission: ["credit.index"]
        },
        {
          parent_id: 26,
          title: "ordered products",
          path: "/credit-sales/ordered-products",
          type: "link",
          level: 2,
          permission: ["credit.index"]
        },
        {
          parent_id: 26,
          title: "repayment",
          path: "/credit-sales/repayment",
          type: "link",
          level: 2,
          permission: ["credit.index"]
        },
        {
          parent_id: 26,
          title: "add batch repayment",
          path: "/credit-sales/add-batch-repayment",
          type: "link",
          level: 2,
          permission: ["credit.create"]
        }
      ],
    },
    {
      id: 27,
      title: "withdrawal",
      active: false,
      icon: "ri-cash-line",
      type: "sub",
      level: 1,
      acl_permission: ["withdrawal.index", "withdrawal.create", "withdrawal.edit"],
      children: [
        {
          parent_id: 27,
          title: "withdrawal",
          path: "/withdrawal",
          type: "link",
          level: 2,
          permission: ["withdrawal.index", "withdrawal.create"]
        },
        {
          parent_id: 27,
          title: "add withdrawal",
          path: "/withdrawal/add-withdrawal",
          type: "link",
          badgeType: 'badge bg-theme text-dark ml-3', 
          badgeValue: 0,
          level: 2,
          permission: ["withdrawal.create"]
        },
        {
          parent_id: 27,
          title: "pending withdrawal",
          path: "/withdrawal/pending-withdrawal",
          type: "link",
          level: 2,
          permission: ["withdrawal.index"]
        },
        {
          parent_id: 27,
          title: "batch withdrawal",
          path: "/withdrawal/batch-withdrawal",
          type: "link",
          level: 2,
          permission: ["withdrawal.create"]
        }
      ],
    },
    {
      id: 29,
      title: "dividend",
      active: false,
      icon: "ri-coin-line",
      type: "sub",
      level: 1,
      acl_permission: ["dividend.index", "dividend.create", "dividend.edit"],
      children: [
        {
          parent_id: 29,
          title: "dividend history",
          path: "/dividend",
          type: "link",
          level: 2,
          permission: ["dividend.index", "dividend.create"]
        },
        {
          parent_id: 29,
          title: "generate dividend",
          path: "/dividend/generate-dividend",
          type: "link",
          badgeType: 'badge bg-theme text-dark ml-3', 
          badgeValue: 0,
          level: 2,
          permission: ["dividend.create"]
        }
      ],
    },
    {
      id: 30,
      title: "wallet transaction",
      path: "/wallet-transaction",
      active: false,
      icon: "ri-exchange-line",
      type: "sub",
      level: 1,
      permission: ["wallet.index"]
    },
    {
      id: 31,
      title: "communication",
      active: false,
      icon: "ri-customer-service-2-line",
      type: "sub",
      level: 1,
      acl_permission: ["communication.index", "communication.create", "communication.edit"],
      children: [
        {
          parent_id: 31,
          title: "broadcast",
          path: "/communication/broadcast",
          type: "link",
          level: 2,
          permission: ["communication.index", "communication.create"]
        },
        {
          parent_id: 31,
          title: "sms report",
          path: "/communication/sms-report",
          type: "link",
          badgeType: 'badge bg-theme text-dark ml-3', 
          badgeValue: 0,
          level: 2,
          permission: ["communication.create"]
        }
      ],
    },
    {
      id: 32,
      title: "reporting",
      active: false,
      icon: "ri-file-chart-line",
      type: "sub",
      level: 1,
      acl_permission: ["reporting.index", "reporting.create", "reporting.edit"],
      children: [
        {
          parent_id: 32,
          title: "savings report",
          path: "/reporting/savings",
          type: "link",
          level: 2,
          permission: ["reporting.index", "reporting.create"]
        },
        {
          parent_id: 32,
          title: "shares report",
          path: "/reporting/shares-report",
          type: "link",
          level: 2,
          permission: ["reporting.index", "reporting.create"]
        },
        {
          parent_id: 32,
          title: "revenue report",
          path: "/reporting/revenue-report",
          type: "link",
          level: 2,
          permission: ["reporting.index"]
        },
        {
          parent_id: 32,
          title: "loan report",
          path: "/reporting/loan-report",
          type: "link",
          level: 2,
          permission: ["reporting.index"]
        },
        {
          parent_id: 32,
          title: "credit sales report",
          path: "/reporting/credit-sales-report",
          type: "link",
          level: 2,
          permission: ["reporting.index", "reporting.create"]
        },
        {
          parent_id: 32,
          title: "ledger balance report",
          path: "/reporting/ledger-balance-report",
          type: "link",
          level: 2,
          permission: ["reporting.index", "reporting.create"]
        },
        {
          parent_id: 32,
          title: "statement",
          path: "/reporting/statement",
          type: "link",
          level: 2,
          permission: ["reporting.index", "reporting.create"]
        }
      ],
    },
    {
      id: 33,
      title: "investment",
      path: "/investment",
      active: false,
      icon: "ri-line-chart-line",
      type: "sub",
      level: 1,
      permission: ["investment.index"]
    },
    {
      id: 34,
      title: "miscellaneous",
      active: false,
      icon: "ri-bank-line",
      type: "sub",
      level: 1,
      acl_permission: ["miscellaneous.index","miscellaneous.create","miscellaneous.edit"],
      children: [
        {
          parent_id: 34,
          title: "bye law",
          path: "/miscellaneous/bye-law",
          type: "link",
          level: 2,
          permission: ["miscellaneous.index", "miscellaneous.create"]
        },
        {
          parent_id: 34,
          title: "minutes",
          path: "/miscellaneous/minutes",
          type: "link",
          level: 2,
          permission: ["miscellaneous.index", "miscellaneous.create"]
        },
        {
          parent_id: 34,
          title: "training",
          path: "/miscellaneous/training-seminar",
          type: "link",
          level: 2,
          permission: ["miscellaneous.index", "miscellaneous.create"]
        },
      ],
    },
    {
      id: 35,
      title: "agent",
      active: false,
      icon: "ri-team-line",
      type: "sub",
      level: 1,
      acl_permission: ["agent.index","agent.create","agent.edit"],
      children: [
        {
          parent_id: 35,
          title: "all agents",
          path: "/agent",
          type: "link",
          level: 2,
          permission: ["agent.index", "agent.create"]
        },
        {
          parent_id: 35,
          title: "transaction",
          path: "/agent/transaction",
          type: "link",
          level: 2,
          permission: ["agent.index"]
        }
      ],
    },
    {
      id: 36,
      title: "user trail",
      active: false,
      icon: "ri-user-star-line",
      type: "sub",
      level: 1,
      acl_permission: ["trail.index","trail.create","trail.edit"],
      children: [
        {
          parent_id: 36,
          title: "users activities",
          path: "/user-trail/user-activities",
          type: "link",
          level: 2,
          permission: ["trail.index", "trail.create"]
        },
        {
          parent_id: 36,
          title: "users login",
          path: "/user-trail/users-login",
          type: "link",
          level: 2,
          permission: ["trail.index", "trail.create"]
        }
      ],
  },
  {
    id: 37,
    title: "settings",
    path: "/setting",
    active: false,
    icon: "ri-settings-3-line",
    type: "sub",
    level: 1,
    permission: ["setting.index"]
  },
  {
    id: 38,
    title: "configurations",
    active: false,
    icon: "ri-settings-3-line",
    type: "sub",
    level: 1,
    acl_permission: ["configurations.index"],
    children: [
      {
        parent_id: 38,
        title: "categories",
        path: "/configurations/categories",
        type: "link",
        level: 2,
        permission: ["configurations.index","configurations.create"]
      },
      {
        parent_id: 38,
        title: "users role",
        path: "/configurations/users-role",
        type: "link",
        level: 2,
        permission: ["configurations.index", "configurations.create"]
      }
    ]
  },
];
