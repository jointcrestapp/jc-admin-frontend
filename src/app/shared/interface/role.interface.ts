import { PaginateModel } from "./core.interface";

export interface RoleModel extends PaginateModel {
  data: Role[];
}

export interface Role {
  id: number;
  name: string;
  guard_name?: string;
  created_at?: string;
  updated_at?: string;
  permissions?: Permission[];
}

export interface Module {
  id: string;
  name: string;
  isChecked: boolean;
  created_at?: string;
  updated_at?: string;
  module_permissions: Permission[];
}

// Permission.id/permission_id are "module.action" string keys (e.g. "credit.index") —
// the same keys used throughout menu.ts and tableConfig.rowActions[].permission.
export interface Permission {
  id: string;
  permission_id: string;
  name: string;
  isChecked?: boolean;
  guard_name?: string;
  created_at?: string;
  updated_at?: string;
}
