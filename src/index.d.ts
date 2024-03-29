declare namespace VirtualProjectTreeNamespace {
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

  export interface Axios {
    request: (arg: any) => any
  }

  export interface HttpGetSubSystemTreeParams {
    platformId: number;
    projectDisableFlag: boolean;
    projectMajorTypeCode: string;
    projectStatusCode: string;
    projectTypeCode: string;
    subSystemMark: string;
    subTreeValue: number;
    consoleId?: string;
  }

  export interface HttpGetHomePageTreeParameterParams {
    businessTreeType: number;
    platformId: number;
    consoleId?: string;
  }
}

