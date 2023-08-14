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
    category?: string;
  }

  export interface BusinessTreeParameter {
    [k: string]: BusinessTreeParameterOption[];
  }

  export interface DefaultActivedBusinessTreeParameter {
    [k: string]: string;
  }

  declare interface Axios {
    request: (arg: any) => any
  }

  declare interface HttpGetSubSystemTreeParams {
    platFormId: number;
    projectDisableFlag: boolean;
    projectMajorTypeCode: string;
    projectStatusCode: string;
    projectTypeCode: string;
    subSystemMark: string;
    subTreeValue: number;
  }

  declare interface HttpGetHomePageTreeParameterParams {
    businessTreeType: number;
    platformId: number;
  }
}