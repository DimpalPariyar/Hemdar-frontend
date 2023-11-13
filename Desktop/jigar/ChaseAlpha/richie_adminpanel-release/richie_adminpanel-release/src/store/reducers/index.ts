// third-party
import { AnyAction, CombinedState, combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { LOGOUT } from 'store/reducers/actions';

// project import
import chat from './chat';
import calendar from './calendar';
import menu from './menu';
import snackbar from './snackbar';
import productReducer from './product';
import cartReducer from './cart';

// project import
import specialProgramReducer from './specialProgram';
import adminListReducer from './adminList';
import programSessions from './programSessions';
import programPlans from './programPlans';
import { PersistPartial } from 'redux-persist/es/persistReducer';
import { CalendarProps } from 'types/calendar';
import { CartStateProps } from 'types/cart';
import { ChatStateProps } from 'types/chat';
import { ProductStateProps } from 'types/e-commerce';
import { MenuProps } from 'types/menu';
import { SnackbarProps } from 'types/snackbar';
import advisoryProduct from './advisoryProduct';
import webinars from './webinars';
import researchList from './researchList';
import counterReducer from './adviceCounter'

// ==============================|| COMBINE REDUCERS ||============================== //
const reducers = combineReducers({
  chat,
  calendar,
  specialProgram: persistReducer(
    {
      key: 'specialProgram',
      storage,
      keyPrefix: 'special-'
    },
    specialProgramReducer
  ),
  adminList: persistReducer(
    {
      key: 'adminList',
      storage,
      keyPrefix: 'special-'
    },
    adminListReducer
  ),
  menu,
  snackbar,
  programSessions: persistReducer(
    {
      key: 'programSessions',
      storage,
      keyPrefix: 'special-'
    },
    programSessions
  ),
  programPlans: persistReducer(
    {
      key: 'programPlans',
      storage,
      keyPrefix: 'special-'
    },
    programPlans
  ),
  cart: persistReducer(
    {
      key: 'cart',
      storage,
      keyPrefix: 'mantis-ts-'
    },
    cartReducer
  ),
  advisoryProduct: advisoryProduct,
  product: productReducer,
  webinars: webinars,
  researchList: researchList,
  counter: counterReducer
});

const rootReducer = (
  state:
    | CombinedState<{
        chat: ChatStateProps;
        calendar: CalendarProps;
        specialProgram: any;
        adminList: any;
        menu: MenuProps;
        snackbar: SnackbarProps;
        programSessions: any;
        programPlans: any;
        cart: CartStateProps & PersistPartial;
        advisoryProduct: any;
        webinars: any;
        product: ProductStateProps;
        researchList: any;
        counter:any;
      }>
    | undefined,
  action: AnyAction
) => {
  if (action.type === LOGOUT) {
    state = undefined;
  }

  return reducers(state, action);
};

export default rootReducer;
