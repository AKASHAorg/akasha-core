
import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug','3d6'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config','914'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content','c28'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData','3cf'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata','31b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry','0da'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes','244'),
    exact: true
  },
  {
    path: '/markdown-page',
    component: ComponentCreator('/markdown-page','be1'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs','351'),
    routes: [
      {
        path: '/docs/docs/',
        component: ComponentCreator('/docs/docs/','35f'),
        exact: true,
        'sidebar': "defaultSidebar"
      },
      {
        path: '/docs/sdk/enums/typings.events.APP_EVENTS',
        component: ComponentCreator('/docs/sdk/enums/typings.events.APP_EVENTS','b78'),
        exact: true,
        'sidebar': "defaultSidebar"
      },
      {
        path: '/docs/sdk/enums/typings.events.AUTH_EVENTS',
        component: ComponentCreator('/docs/sdk/enums/typings.events.AUTH_EVENTS','e6f'),
        exact: true,
        'sidebar': "defaultSidebar"
      },
      {
        path: '/docs/sdk/enums/typings.events.COMMENTS_EVENTS',
        component: ComponentCreator('/docs/sdk/enums/typings.events.COMMENTS_EVENTS','322'),
        exact: true,
        'sidebar': "defaultSidebar"
      },
      {
        path: '/docs/sdk/enums/typings.events.ENS_EVENTS',
        component: ComponentCreator('/docs/sdk/enums/typings.events.ENS_EVENTS','4fe'),
        exact: true,
        'sidebar': "defaultSidebar"
      },
      {
        path: '/docs/sdk/enums/typings.events.ENTRY_EVENTS',
        component: ComponentCreator('/docs/sdk/enums/typings.events.ENTRY_EVENTS','70f'),
        exact: true,
        'sidebar': "defaultSidebar"
      },
      {
        path: '/docs/sdk/enums/typings.events.PROFILE_EVENTS',
        component: ComponentCreator('/docs/sdk/enums/typings.events.PROFILE_EVENTS','624'),
        exact: true,
        'sidebar': "defaultSidebar"
      },
      {
        path: '/docs/sdk/enums/typings.events.TAG_EVENTS',
        component: ComponentCreator('/docs/sdk/enums/typings.events.TAG_EVENTS','932'),
        exact: true,
        'sidebar': "defaultSidebar"
      },
      {
        path: '/docs/sdk/enums/typings.events.WEB3_EVENTS',
        component: ComponentCreator('/docs/sdk/enums/typings.events.WEB3_EVENTS','989'),
        exact: true,
        'sidebar': "defaultSidebar"
      },
      {
        path: '/docs/sdk/interfaces/AWF_SDK',
        component: ComponentCreator('/docs/sdk/interfaces/AWF_SDK','23f'),
        exact: true,
        'sidebar': "defaultSidebar"
      },
      {
        path: '/docs/sdk/interfaces/SDK_API',
        component: ComponentCreator('/docs/sdk/interfaces/SDK_API','c1c'),
        exact: true,
        'sidebar': "defaultSidebar"
      },
      {
        path: '/docs/sdk/interfaces/SDK_Services',
        component: ComponentCreator('/docs/sdk/interfaces/SDK_Services','64a'),
        exact: true,
        'sidebar': "defaultSidebar"
      },
      {
        path: '/docs/sdk/interfaces/typings.IAwfSDK',
        component: ComponentCreator('/docs/sdk/interfaces/typings.IAwfSDK','2b2'),
        exact: true,
        'sidebar': "defaultSidebar"
      },
      {
        path: '/docs/sdk/interfaces/typings.Services',
        component: ComponentCreator('/docs/sdk/interfaces/typings.Services','e84'),
        exact: true,
        'sidebar': "defaultSidebar"
      },
      {
        path: '/docs/sdk/modules',
        component: ComponentCreator('/docs/sdk/modules','18e'),
        exact: true,
        'sidebar': "defaultSidebar"
      },
      {
        path: '/docs/sdk/namespaces/typings',
        component: ComponentCreator('/docs/sdk/namespaces/typings','436'),
        exact: true,
        'sidebar': "defaultSidebar"
      },
      {
        path: '/docs/sdk/namespaces/typings.events',
        component: ComponentCreator('/docs/sdk/namespaces/typings.events','626'),
        exact: true,
        'sidebar': "defaultSidebar"
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/','f49'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*')
  }
];
