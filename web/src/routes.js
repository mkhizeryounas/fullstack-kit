import Home from './pages/Home';
import Storage from './pages/Storage';
import Profile from './pages/Profile';
import ApiList from './pages/DatabaseManagement';
import Settings from './pages/Settings';

import {
  DatabaseOutlined,
  AppstoreAddOutlined,
  SettingOutlined,
  DashboardOutlined,
} from '@ant-design/icons';

const ROUTES = [
  {
    name: 'dashboard',
    path: '/dashboard',
    exact: true,
    title: 'Dashboard',
    component: Home,
    sidebar: true,
    icon: DashboardOutlined,
  },
  {
    name: 'database',
    path: '/database',
    title: 'Database',
    component: ApiList,
    sidebar: true,
    icon: DatabaseOutlined,
  },
  {
    name: 'storage',
    path: '/storage',
    title: 'Storage',
    component: Storage,
    sidebar: true,
    icon: AppstoreAddOutlined,
  },
  {
    name: 'settings',
    path: '/settings',
    title: 'Settings',
    component: Settings,
    sidebar: true,
    icon: SettingOutlined,
  },
  {
    name: 'profile',
    path: '/profile',
    exact: true,
    title: 'Profile',
    component: Profile,
    sidebar: false,
  },
];

export default ROUTES;
