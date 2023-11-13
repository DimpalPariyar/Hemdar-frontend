import { format } from 'date-fns';
import { PermissionSelection } from './PermissionSelection';
export const columns = [
  {
    Header: 'Name',
    accessor: 'name'
  },
  {
    Header: 'Email',
    accessor: 'email'
  },
  {
    Header: 'Mobile',
    accessor: 'mobile'
  },
  {
    Header: 'Last Login',
    accessor: ({ lastLogin }: any) => (lastLogin ? format(new Date(lastLogin), 'dd MMM yyyy') : 'NA')
  },
  {
    Header: 'Create Permissions',
    style: {
      width: 400
    },
    disableSortBy: true,
    accessor: ({ _id, createAccess }: any) => {
      let values: any = [];
      if (createAccess === undefined) {
        values = [];
      } else values = createAccess?.product?.map((value: any) => value) || [];
      return <PermissionSelection userId={_id} values={values} type={'createAccess'} />;
    }
  },
  {
    Header: 'Update Permissions',
    style: {
      width: 400
    },
    disableSortBy: true,
    accessor: ({ _id, updateAccess }: any) => {
      let values: any = [];
      if (updateAccess === undefined) {
        values = [];
      } else values = updateAccess?.product?.map((value: any) => value) || [];
      return <PermissionSelection userId={_id} values={values} type={'updateAccess'} />;
    }
  },
  {
    Header: 'View Permissions',
    style: {
      width: 400
    },
    disableSortBy: true,
    accessor: ({ _id, viewAccess }: any) => {
      let values: any = [];
      if (viewAccess === undefined) {
        values = [];
      } else values = viewAccess?.product?.map((value: any) => value) || [];
      return <PermissionSelection userId={_id} values={values} type={'viewAccess'} />;
    }
  }
];
