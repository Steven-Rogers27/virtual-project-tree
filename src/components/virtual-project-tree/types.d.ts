namespace VirtualProjectTree {
  export interface BusinessTreeNode {
    id: string;
    idInfo: string;
    parentIdInfo: string;
    providerId: string;
    type: string;
    name: string;
    fullName: string;
    orderNum: number | null;
    uniqueOrder: string;
    children: BusinessTreeNode[];
    projectNodeType: number;
    projectStatusCode: unknown;
    projectStatusDef: unknown;
    projectTypeCode: unknown;
    projectTypeDef: unknown;
    keyProjectFlag: boolean;
    keyProjectCode: unknown;
    keyProjectDef: unknown;
    permissionMarks: unknown;
  }

  export interface BusinessTreeParameterOption {
    code: string;
    name: string;
    active?: boolean
  }

  export interface BusinessTreeParameter {
    [k: string]: BusinessTreeParameterOption[];
  }
}