import axios from 'utils/axios';
import { BASE_URL } from 'config';
import { useEffect, useState } from 'react';
import BasicTable from 'components/react-table/BasicTable';
import { columns, paymentColumns } from './constant';
//import ScrollX from 'components/ScrollX';
import { Box } from '@mui/system';
import SearchInput from 'components/SearchInput';
import { Button, Stack, TextField } from '@mui/material';
import Autocomplete from 'components/AutoComplete';
import Loader from 'components/Loader';

const bgColor = {
  background: 'linear-gradient(103.4deg, #2D00D2 12.04%, #2C00D3 30.87%, #3700C8 46.11%, #3E00C0 63.54%, #4B00B4 80.82%, #5400AA 93.76%)',
  color: ' #FFFFFF',
  borderRadius: '10px'
};
const AdviceList = () => {
  const [data, setData] = useState<any>({});
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalUser, setTotalUser] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>('');
  const [paid, setPaid] = useState<boolean | null>(null);
  const [options, setOptions] = useState<any>([]);
  const [product, setProduct] = useState<any>([]);
  const [productCount, setProductCount] = useState<any>();

  const init = async () => {
    try {
      setLoading(true);
      const params: any = {
        page,
        limit: 10,
        paid: paid,
        product: product
      };

      if (searchText) params.search = searchText;
      const response = await axios.get(`${BASE_URL}/admin/orders?${new URLSearchParams(params).toString()}`);
      setData(response.data || []);
      setTotalUser(response.data.total);
      setProductCount(response.data.productCount);
      const res = await axios.get(`${BASE_URL}/advisory/product`);
      const data = (res.data || []).map((item: any) => ({
        label: item['productTitle'],
        value: item._id
      }));
      setOptions(data);
    } catch (error) {
      console.log({ error: error });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPage(page);
  };
  const handleChangePaid = () => {
    setPaid(true);
  };
  const handleChangeNotVerified = () => {
    setPaid(false);
  };
  const handleRefresh = () => {
    setPaid(null);
  };
  const onItemChange = (e: any, value: any) => {
    value && setProduct(value.map((x: any) => x.label));
  };

  useEffect(() => {
    init();
  }, [page, searchText, paid, product]);
  return (
    <>
      {(!data.items || loading) && <Loader />}
      <Box display="flex" flexDirection="column">
        <Box display="flex" justifyContent="flex-end">
          <Box sx={{ position: 'absolute', top: 0 }}>
            <SearchInput onChange={setSearchText} />
          </Box>
        </Box>
        {data.items && !loading && (
          <>
            <Stack direction="row" spacing={2} sx={{ position: 'absolute', right: 0 }}>
              <Autocomplete
                name="nameOfUnderlying"
                multiple
                value={product}
                clearOnBlur
                disableCloseOnSelect={false}
                onChange={onItemChange}
                options={options}
                sx={{ width: '350px' }}
                renderInput={(params: any) => <TextField {...params} label="Search by Products" />}
                renderOption={(props: any, option: any) => (
                  <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    {option.label}(
                    {option.label === 'Cash Stocks Poisitional'
                      ? productCount?.cashstockpositionCount
                      : option.label === 'Energy & Gas'
                      ? productCount?.energyandgasCount
                      : option.label === 'Metals'
                      ? productCount?.metalCount
                      : option.label === 'NIFTY Options'
                      ? productCount?.niftyoptionCount
                      : option.label === 'Bang Bang BANKNIFTY'
                      ? productCount?.bangbangniftyCount
                      : option.label === 'Momentum Futures'
                      ? productCount?.momentfutureCount
                      : option.label === 'Index Futures'
                      ? productCount?.indexfutureCount
                      : option.label === 'Bullion'
                      ? productCount?.bullionCount
                      : option.label === 'Options Combo'
                      ? productCount?.optioncomboCount
                      : option.label === 'Index Option Combo'
                      ? productCount?.indexoptioncomboCount
                      : option.label === 'Futures Combo'
                      ? productCount?.futurecomboCount
                      : option.label === 'Stock Options'
                      ? productCount?.stockoptionCount
                      : ''}
                    ){/* ({option.label === "Energy & Gas" ? productCount.energyandgasCount : ""}) */}
                  </Box>
                )}
              />
              <Button sx={bgColor} onClick={handleChangePaid}>
                {paid === true ? `Paid Order  (${totalUser})` : `Paid Order`}
              </Button>
              <Button sx={bgColor} onClick={handleChangeNotVerified}>
                {paid === false ? `Attempted Order  (${totalUser})` : `Attempted Order`}
              </Button>
              <Button sx={bgColor} onClick={handleRefresh}>
                {paid === null ? `Total Order  (${totalUser})` : `Total Order`}
              </Button>
            </Stack>
            <BasicTable
              childColumns={paymentColumns}
              childDataKey="payments"
              columns={columns()}
              getHeaderProps={(column: any) => column.getSortByToggleProps()}
              data={data.items}
              currentPage={data.page}
              totalPage={data.pageTotal}
              onPageChange={handlePageChange}
              striped
            />
          </>
        )}
      </Box>
    </>
  );
};

export default AdviceList;
