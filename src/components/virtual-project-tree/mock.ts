import treeResp from './business-tree-response.json'

export const businessTreeMock = treeResp.data

export const categoryListMock = [
  {
    category: '状态',
    options: [
      {
        name: '进场',
      },
      {
        name: '在建',
      },
      {
        name: '收尾',
      },
      {
        name: '竣工',
      },
      {
        name: '停工',
      },
      {
        name: '其他',
      },
      {
        name: '清欠',
      },
      {
        name: '销号',
      },
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