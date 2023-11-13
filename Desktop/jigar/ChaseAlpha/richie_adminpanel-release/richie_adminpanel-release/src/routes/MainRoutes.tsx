import { lazy } from 'react';

// project import
import MainLayout from 'layout/MainLayout';
import Loadable from 'components/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';
import AdviceUpdate from '../pages/advice-update';
import RequiredPermission from 'utils/route-guard/RequiredPermission';
import OrderEdit from 'pages/order-edit';

const RiskProfile = Loadable(lazy(() => import('pages/risk-profile/index')));
const SpecialPrograms = Loadable(lazy(() => import('pages/special-programs')));
const SpecialProgramsDetail = Loadable(lazy(() => import('pages/special-programs-detail')));
const SessionList = Loadable(lazy(() => import('pages/special-programs/sessions/SessionList')));
const PlanList = Loadable(lazy(() => import('pages/special-programs/plans/planList')));

const Advisory = Loadable(lazy(() => import('pages/advisory/index')));
const AdvisoryCreate = Loadable(lazy(() => import('pages/advisory-create')));
const WebinarCreate = Loadable(lazy(() => import('pages/webinar-create')));
const AdviceCreate = Loadable(lazy(() => import('pages/advice-create')));
const Notify = Loadable(lazy(() => import('pages/notify')));
const AdviceList = Loadable(lazy(() => import('pages/advice-list')));
const WebinarList = Loadable(lazy(() => import('pages/webinar-list')));
const WebinarEdit = Loadable(lazy(() => import('pages/webinar-edit')));
const AdvisoryEdit = Loadable(lazy(() => import('pages/advisory-edit')));
const AdvisoryDetail = Loadable(lazy(() => import('pages/advisory-detail')));
const HostProfile = Loadable(lazy(() => import('pages/host-profile')));
const UserList = Loadable(lazy(() => import('pages/user-list')));
const UserDetail = Loadable(lazy(() => import('pages/user-detail')));
const AdminList = Loadable(lazy(() => import('pages/admin-list')));
const TransactionList = Loadable(lazy(() => import('pages/transaction-list')));
const FaqList = Loadable(lazy(() => import('pages/faq-list')));
const FaqCreate = Loadable(lazy(() => import('pages/faq-create')));
const FaqEdit = Loadable(lazy(() => import('pages/faq-edit')));
const AdvisoryMaster = Loadable(lazy(() => import('pages/advisory-master')));
const OrderList = Loadable(lazy(() => import('pages/order-list')));
const MessageNotification = Loadable(lazy(() => import('pages/message-notification')));
const HniNotification = Loadable(lazy(() => import('pages/hni-notification')));
const BetaUserList = Loadable(lazy(() => import('pages/beta-user-list')));
const AddCoupons = Loadable(lazy(() => import('pages/add-new-coupon')));
const CouponList = Loadable(lazy(() => import('pages/coupon-list')));
const EditCoupons = Loadable(lazy(() => import('pages/coupon-edit')));
const SubscriptionList = Loadable(lazy(() => import('pages/subscription-list')));
const CreateOrder = Loadable(lazy(() => import('pages/order-create')));
const UserActions = Loadable(lazy(() => import('pages/User-Actions')));
const Process = Loadable(lazy(() => import('pages/process')));
const SalesReport = Loadable(lazy(() => import('pages/sales-report')));
const ActiveSubscriptionCount = Loadable(lazy(() => import('pages/active-subscription-count')));
const TechAnalystList = Loadable(lazy(() => import('pages/tech-analyst-list')));
const TypeOfNotification = Loadable(lazy(() => import('pages/notifytype-create')));
const ChatScreen = Loadable(lazy(() => import('pages/chat-screen')));
const OptionAdviceCreate = Loadable(lazy(() => import('pages/advisory-option-create')));
// ==============================|| MAIN ROUTING ||============================== //

//------Levels-----//
// level 1 ----> Advisory Admin
// level 2 ----> Learn Module Admin
// level 3 ----> Trade flash Admin
// level 4 ----> Super Admin
// level 5 ----> Research
// level 6 ----> Support
// level 7 ----> Sales
// level 8 ----> Accounts

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: (
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      ),
      children: [
        {
          path: 'risk-profile',
          element: (
            <RequiredPermission level={6}>
              <RiskProfile />
            </RequiredPermission>
          )
        },
        {
          path: 'special-programs',
          element: (
            <RequiredPermission level={6}>
              <SpecialPrograms />
            </RequiredPermission>
          )
        },
        {
          path: 'special-programs/:id',
          element: (
            <RequiredPermission level={6}>
              <SpecialProgramsDetail />
            </RequiredPermission>
          )
        },
        {
          path: 'session-list',
          element: (
            <RequiredPermission level={6}>
              <SessionList />
            </RequiredPermission>
          )
        },
        {
          path: 'session-plans',
          element: (
            <RequiredPermission level={6}>
              <PlanList />
            </RequiredPermission>
          )
        },
        {
          path: 'instructors',
          element: (
            <RequiredPermission level={6}>
              <HostProfile />
            </RequiredPermission>
          )
        },
        {
          path: 'advisory',
          element: (
            <RequiredPermission level={3}>
              <Advisory />
            </RequiredPermission>
          )
        },
        {
          path: 'advisory-master',
          element: (
            <RequiredPermission level={3}>
              <AdvisoryMaster />
            </RequiredPermission>
          )
        },
        {
          path: 'advisory-create',
          element: (
            <RequiredPermission level={3}>
              <AdvisoryCreate />
            </RequiredPermission>
          )
        },
        {
          path: 'option-advice-create',
          element: (
            <RequiredPermission level={3}>
              <OptionAdviceCreate />
            </RequiredPermission>
          )
        },
        {
          path: 'advice-create',
          element: (
            <RequiredPermission level={5}>
              <AdviceCreate />
            </RequiredPermission>
          )
        },
        {
          path: 'notify',
          element: (
            <RequiredPermission level={5}>
              <Notify />
            </RequiredPermission>
          )
        },
        {
          path: 'chatscreen',
          element: (
            <RequiredPermission level={5}>
              <ChatScreen />
            </RequiredPermission>
          )
        },
        {
          path: 'orders',
          element: (
            <RequiredPermission level={8}>
              <OrderList />
            </RequiredPermission>
          )
        },
        {
          path: 'orders-create',
          element: (
            <RequiredPermission level={8}>
              <CreateOrder />
            </RequiredPermission>
          )
        },
        {
          path: 'orders-edit/:id',
          element: (
            <RequiredPermission level={8}>
              <OrderEdit />
            </RequiredPermission>
          )
        },
        {
          path: 'sales-report',
          element: (
            <RequiredPermission level={8}>
              <SalesReport />
            </RequiredPermission>
          )
        },
        {
          path: 'active-subscription',
          element: (
            <RequiredPermission level={8}>
              <SubscriptionList />
            </RequiredPermission>
          )
        },
        {
          path: 'active-subscriptioncount',
          element: (
            <RequiredPermission level={8}>
              <ActiveSubscriptionCount />
            </RequiredPermission>
          )
        },
        {
          path: 'advice-update/:id',
          element: (
            <RequiredPermission level={5}>
              <AdviceUpdate />
            </RequiredPermission>
          )
        },
        {
          path: 'advice',
          element: (
            <RequiredPermission level={5}>
              <AdviceList />
            </RequiredPermission>
          )
        },
        {
          path: 'transaction-list',
          element: (
            <RequiredPermission level={1}>
              <TransactionList />
            </RequiredPermission>
          )
        },
        {
          path: 'advisory-edit/:id',
          element: (
            <RequiredPermission level={5}>
              <AdvisoryEdit />
            </RequiredPermission>
          )
        },
        {
          path: 'webinar-edit/:id',
          element: (
            <RequiredPermission level={7}>
              <WebinarEdit />
            </RequiredPermission>
          )
        },
        {
          path: '/add-coupons',
          element: (
            <RequiredPermission level={7}>
              <AddCoupons />
            </RequiredPermission>
          )
        },
        {
          path: '/coupons-list',
          element: (
            <RequiredPermission level={7}>
              <CouponList />
            </RequiredPermission>
          )
        },
        {
          path: '/coupons-edit/:id',
          element: (
            <RequiredPermission level={7}>
              <EditCoupons />
            </RequiredPermission>
          )
        },
        {
          path: 'advisory-detail/:id',
          element: (
            <RequiredPermission level={5}>
              <AdvisoryDetail />
            </RequiredPermission>
          )
        },
        {
          path: 'faq-list',
          element: (
            <RequiredPermission level={6}>
              <FaqList />
            </RequiredPermission>
          )
        },
        {
          path: 'faq-create',
          element: (
            <RequiredPermission level={6}>
              <FaqCreate />
            </RequiredPermission>
          )
        },
        {
          path: 'faq-edit/:id',
          element: (
            <RequiredPermission level={6}>
              <FaqEdit />
            </RequiredPermission>
          )
        },
        {
          path: 'user/action',
          element: (
            <RequiredPermission level={6}>
              <UserActions />
            </RequiredPermission>
          )
        },
        {
          path: 'admin',
          children: [
            {
              path: 'user-list',
              element: (
                <RequiredPermission level={3}>
                  <UserList />
                </RequiredPermission>
              )
            },
            {
              path: 'user-list/detail/:id',
              element: (
                <RequiredPermission level={3}>
                  <UserDetail />
                </RequiredPermission>
              )
            },
            {
              path: 'admin-list',
              element: (
                <RequiredPermission level={3}>
                  <AdminList />
                </RequiredPermission>
              )
            },
            {
              path: 'beta-user-list',
              element: (
                <RequiredPermission level={3}>
                  <BetaUserList />
                </RequiredPermission>
              )
            },
            {
              path: 'message-notification-list',
              element: (
                <RequiredPermission level={3}>
                  <MessageNotification />
                </RequiredPermission>
              )
            },
            {
              path: 'hni-notification-list',
              element: (
                <RequiredPermission level={3}>
                  <HniNotification />
                </RequiredPermission>
              )
            },
            {
              path: 'createtypes',
              element: (
                <RequiredPermission level={3}>
                  <TypeOfNotification />
                </RequiredPermission>
              )
            },
            {
              path: 'analyst-list',
              element: (
                <RequiredPermission level={3}>
                  <TechAnalystList />
                </RequiredPermission>
              )
            },
            {
              path: 'process',
              element: (
                <RequiredPermission level={3}>
                  <Process />
                </RequiredPermission>
              )
            }
          ]
        },
        {
          path: 'webinar-list',
          element: (
            <RequiredPermission level={7}>
              <WebinarList />
            </RequiredPermission>
          )
        },
        {
          path: 'webinar-create',
          element: (
            <RequiredPermission level={7}>
              <WebinarCreate />
            </RequiredPermission>
          )
        }
      ]
    }
  ]
};

export default MainRoutes;
