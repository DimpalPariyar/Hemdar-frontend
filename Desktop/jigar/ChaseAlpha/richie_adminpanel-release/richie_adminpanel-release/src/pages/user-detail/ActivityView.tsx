import BasicTable from 'components/react-table/BasicTable';
import ScrollX from 'components/ScrollX';
import { Box } from '@mui/system';
import Loader from 'components/Loader';

const ActivityView = ({ columns, data = [], loading, currentPage, totalPage, onPageChange }: any) => {

  if (loading) {
    return <Loader />;
  }
  return (
    <Box display="flex" flexDirection="column">
      <ScrollX>
        <BasicTable
          columns={columns}
          data={data}
          currentPage={currentPage}
          totalPage={totalPage}
          onPageChange={onPageChange}
          striped
          disableFilters
        />
      </ScrollX>
    </Box>
  );
};

export default ActivityView;
