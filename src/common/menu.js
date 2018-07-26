import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: '机会监控',
    icon: 'dashboard',
    path: 'chance',
    children: [
      {
        name: '外汇搬砖',
        path: 'foreign',
      },
      {
        name: '外汇搬砖监控详情',
        path: 'foreignDetails',
        // hideInBreadcrumb: true,
        hideInMenu: true,
      },
      {
        name: '搬砖',
        path: 'move-bricks',
      },
      {
        name: '搬砖监控详情',
        path: 'bricksDetails',
        // hideInBreadcrumb: true,
        hideInMenu: true,
      },
      {
        name: '对冲',
        path: 'redging',
      },
      {
        name: '对冲监控详情',
        path: 'redgingDetails',
        // hideInBreadcrumb: true,
        hideInMenu: true,
      },
    ],
  },
  {
    name: '现有数据',
    icon: 'hourglass',
    path: 'available',
    children: [
      {
        name: '搬砖',
        path: 'move-bricks',
      },
      {
        name: '搬砖1',
        path: 'bricksDetails',
      },
      {
        name: '对冲',
        path: 'redging',
      },
      {
        name: '对冲1',
        path: 'redgingDetails',
      },
    ],
  },
  {
    name: '',
    icon: 'dashboard',
    path: 'dashboard',
    children: [
      {
        name: '分析页',
        path: 'analysis',
      },
      {
        name: '监控页',
        path: 'test',
      },
      {
        name: '工作台',
        path: 'workplace',
        // hideInBreadcrumb: true,
         hideInMenu: true,
      },
    ],
  },
  {
    name: '',
    icon: 'form',
    path: 'form',
    children: [
      {
        name: '基础表单',
        path: 'basic-form',
      },
      {
        name: '分步表单',
        path: 'step-form',
      },
      {
        name: '高级表单',
        authority: 'admin',
        path: 'advanced-form',
      },
    ],
  },
  {
    name: '',
    icon: 'table',
    path: 'list',
    children: [
      {
        name: '查询表格',
        path: 'table-list',
      },
      {
        name: '标准列表',
        path: 'basic-list',
      },
      {
        name: '卡片列表',
        path: 'card-list',
      },
      {
        name: '搜索列表',
        path: 'search',
        children: [
          {
            name: '搜索列表（文章）',
            path: 'articles',
          },
          {
            name: '搜索列表（项目）',
            path: 'projects',
          },
          {
            name: '搜索列表（应用）',
            path: 'applications',
          },
        ],
      },
    ],
  },
  {
    name: '',
    icon: 'profile',
    path: 'profile',
    children: [
      {
        name: '基础详情页',
        path: 'basic',
      },
      {
        name: '高级详情页',
        path: 'advanced',
        authority: 'admin',
      },
    ],
  },
  {
    name: '',
    icon: 'check-circle-o',
    path: 'result',
    children: [
      {
        name: '成功',
        path: 'success',
      },
      {
        name: '失败',
        path: 'fail',
      },
    ],
  },
  {
    name: '',
    icon: 'warning',
    path: 'exception',
    children: [
      {
        name: '403',
        path: '403',
      },
      {
        name: '404',
        path: '404',
      },
      {
        name: '500',
        path: '500',
      },
      {
        name: '触发异常',
        path: 'trigger',
        hideInMenu: true,
      },
    ],
  },
  {
    name: '账户',
    icon: 'user',
    path: 'user',
    authority: 'guest',
    children: [
      {
        name: '登录',
        path: 'login',
      },
      {
        name: '注册',
        path: 'register',
      },
      {
        name: '注册结果',
        path: 'register-result',
      },
    ],
  },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
