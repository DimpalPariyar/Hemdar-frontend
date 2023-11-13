// material-ui
import { format } from 'date-fns';
import { PermissionSelection } from './PermissionSelection';
import { Status } from './Status';
import Password from './Password';

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
    Header: 'Role',
    style: {
      width: 400
    },
    disableSortBy: true,
    accessor: ({ type, _id }: any) => {
      const values: any = type.map(({ value }: any) => value);
      return <PermissionSelection userId={_id} values={values} />;
    }
  },
  {
    Header: 'Status',
    Cell: ({ cell }: any) => {
      const value = cell.row.original.status.value;
      return <Status enabled={value === 1} userId={cell.row.original._id} />;
    }
  },
  {
    Header: 'Password',
    className: 'cell-right',
    disableSortBy: true,
    Cell: ({ cell }: any) => <Password email={cell.row.original.email} />
  }
];
