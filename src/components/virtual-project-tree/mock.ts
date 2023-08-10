import treeResp from './business-tree-response.json'

export const businessTreeMock = treeResp.data

export const categoryListMock = [
  {
    category: '状态',
    options: [
      {
        "code": "0100",
        "name": "进场"
      },
      {
        "code": "0200",
        "name": "在建"
      },
      {
        "code": "4",
        "name": "收尾"
      },
      {
          "code": "5",
          "name": "竣工"
      },
      {
          "code": "0300",
          "name": "停工"
      },
      {
          "code": "7",
          "name": "其它"
      },
      {
          "code": "6",
          "name": "清欠"
      },
      {
          "code": "8",
          "name": "销号"
      }
    ],
  },
  {
    category: '工程类型',
    options: [
      {
        name: '铁路',
      },
      {
        name: '公路',
      },
      {
        name: '城市轨道交通',
      },
      {
        name: '房屋建筑工程',
      },
      {
        name: '市政工程',
      },
      {
        name: '矿山开采',
      },
      {
        name: '机场工程',
      },
      {
        name: '电力工程',
      },
    ],
  },
  {
    category: '重点项目',
    options: [
      {
        name: '非重点',
      },
      {
        name: '公司重点',
      },
      {
        name: '集团重点',
      },
      {
        name: '股份公司重点',
      },
    ],
  },
]