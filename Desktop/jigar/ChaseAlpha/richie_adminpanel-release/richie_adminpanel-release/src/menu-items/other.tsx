// assets
import {
  AreaChartOutlined,
  ChromeOutlined,
  QuestionOutlined,
  SecurityScanOutlined,
  StopOutlined,
  TeamOutlined,
  UserOutlined,
  BulbOutlined,
  SnippetsOutlined,
  DollarCircleOutlined,
  PlaySquareOutlined,
  ExclamationCircleOutlined,
  DashboardOutlined,
  MehOutlined
} from '@ant-design/icons';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = {
  UserOutlined,
  TeamOutlined,
  BulbOutlined,
  MehOutlined,
  DashboardOutlined,
  PlaySquareOutlined,
  SecurityScanOutlined,
  DollarCircleOutlined,
  ExclamationCircleOutlined,
  SnippetsOutlined,
  AreaChartOutlined,
  ChromeOutlined,
  QuestionOutlined,
  StopOutlined
};

// ==============================|| MENU ITEMS - SUPPORT ||============================== //


//------Levels-----//
// level 1 ----> Advisory Admin
// level 2 ----> Learn Module Admin
// level 3 ----> Trade flash Admin
// level 4 ----> Super Admin
// level 5 ----> Research
// level 6 ----> Support
// level 7 ----> Sales
// level 8 ----> Accounts



const other: NavItemType = {
  id: 'other',
  title: 'Dashboard',
  type: 'group',
  children: [
    {
      id: 'risk-profile',
      title: 'Risk Profile',
      type: 'item',
      url: '/risk-profile',
      icon: icons.UserOutlined,
      level: 6
    },
    {
      id: 'special-programs',
      title: 'Special Programs',
      type: 'item',
      url: '/special-programs',
      icon: icons.AreaChartOutlined,
      level: 6
    },
    {
      id: 'admin-items',
      title: 'Admin',
      type: 'collapse',
      icon: icons.TeamOutlined,
      level: 3,
      children: [
        {
          id: 'admin-user-list',
          title: 'User List',
          type: 'item',
          url: '/admin/user-list',
          level: 3
        },
        {
          id: 'admin-list',
          title: 'Admin List',
          type: 'item',
          url: '/admin/admin-list',
          level: 3
        },
        {
          id: 'betaUser-list',
          title: ' BetaUser List',
          type: 'item',
          url: '/admin/beta-user-list',
          level: 3
        },
        {
          id: 'tech-analyst',
          title: 'Tech-Analyst List',
          type: 'item',
          url: '/admin/analyst-list',
          level: 3
        },
        {
          id: 'process',
          title: 'Process',
          type: 'item',
          url: '/admin/process',
          level: 3
        }
      ]
    },
    {
      id: 'notification-items',
      title: 'Notification',
      type: 'collapse',
      icon: icons.TeamOutlined,
      level: 3,
      children: [
        {
          id: 'messagenotification-list',
          title: 'Message Notification',
          type: 'item',
          url: '/admin/message-notification-list',
          level: 3
        },
        {
          id: 'hniNotificaiton-list',
          title: 'HNI Notifications',
          type: 'item',
          url: '/admin/hni-notification-list',
          level: 3
        },
        {
          id: 'createNotification-list',
          title: 'Create Notificaiton types',
          type: 'item',
          url: '/admin/createtypes',
          level: 3
        }
      ]
    },
    {
      id: 'advisory-product',
      title: 'Advisory',
      type: 'collapse',
      icon: icons.SnippetsOutlined,
      level: 3,
      children: [
        {
          id: 'advisory-master-list',
          title: 'Advisory Master',
          type: 'item',
          url: '/advisory-master',
          level: 3
        },
        {
          id: 'advisory-product-list',
          title: 'Advisory Product',
          type: 'item',
          url: '/advisory',
          level: 3
        }
      ]
    },
    {
      id: 'advice',
      title: 'Advice',
      type: 'collapse',
      icon: icons.BulbOutlined,
      level: 5,
      children: [
        {
          id: 'advisory',
          title: 'Advice',
          type: 'item',
          url: '/advice',
          level: 5
        },
        {
          id: 'advice-create',
          title: 'Create Advice',
          type: 'item',
          url: '/advice-create',
          level: 5
        },
        {
          id: 'option-advice-create',
          title: 'Create Option Advice',
          type: 'item',
          url: '/option-advice-create',
          level: 5
        },
        {
          id: 'notify',
          title: 'Notify',
          type: 'item',
          url: '/notify',
          level: 5
        },
        {
          id: 'chat',
          title: 'Broadcast',
          type: 'item',
          url: '/chatscreen',
          level: 5
        }
      ]
    },
    {
      id: 'subscription',
      title: 'Subscription',
      type: 'collapse',
      icon: icons.DollarCircleOutlined,
      level: 8,
      children: [
        {
          id: 'orders',
          title: 'Orders',
          type: 'item',
          url: '/orders',
          level: 8
        },
        {
          id: 'orders-create',
          title: 'Order Create',
          type: 'item',
          url: '/orders-create',
          level: 8
        },
        {
          id: 'sales-report',
          title: 'Sales Report',
          type: 'item',
          url: '/sales-report',
          level: 8
        },
        {
          id: 'active-subscription',
          title: 'Active Subscription',
          type: 'item',
          url: '/active-subscription',
          level: 8
        },
        {
          id: 'count-subscription',
          title: 'Active Subscription Count',
          type: 'item',
          url: '/active-subscriptioncount',
          level: 8
        }
      ]
    },
    {
      id: 'marketing',
      title: 'Marketing',
      type: 'collapse',
      icon: icons.DollarCircleOutlined,
      level: 7,
      children: [
        {
          id: 'add-newCoupons',
          title: 'Add New Coupons',
          type: 'item',
          url: '/add-coupons',
          level: 7
        },
        {
          id: 'coupon-list',
          title: 'Coupon List ',
          type: 'item',
          url: '/coupons-list',
          level: 7
        }
      ]
    },
    {
      id: 'host-profile',
      title: 'Host Profile',
      type: 'item',
      url: '/instructors',
      icon: icons.MehOutlined,
      level: 6
    },
    {
      id: 'webinars',
      title: 'Webinars',
      type: 'item',
      url: '/webinar-list',
      icon: icons.PlaySquareOutlined,
      level: 7
    },
    {
      id: 'faq',
      title: 'Faq',
      type: 'item',
      url: '/faq-list',
      icon: icons.ExclamationCircleOutlined,
      level: 6
    },
    {
      id: 'Useractions',
      title: 'User Action',
      type: 'item',
      url: '/user/action',
      icon: icons.ExclamationCircleOutlined,
      level: 6
    }

  ]
};

export default other;
