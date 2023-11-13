import axios from 'utils/axios';
import { BASE_URL } from 'config';
import { useEffect, useState, useRef } from 'react';
import BasicTable from 'components/react-table/BasicTable';
import { columns } from './constant';
import { Button, IconButton, TextField, Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import useMaster from 'hooks/useActivityMaster';
import qs from 'qs';
import { socket } from 'services/socket';
import { openSnackbar, closeSnackbar } from 'store/reducers/snackbar';
import { useDispatch } from 'store';
import { Stack } from '@mui/material';
import SearchInput from 'components/SearchInput';
import Autocomplete from 'components/AutoComplete';
import Loader from 'components/Loader';
import AdviceDetailForm from 'components/adviceudpates-chat/AdviceDetailForm';
import { useSelector } from 'react-redux';
import AdviceChat from 'components/adviceudpates-chat/AdviceChat';
import AddIcon from '@mui/icons-material/Add';
import UpdateChatAdviceStatus from 'components/adviceudpates-chat/UpdateChatAdviceStatus';
const bgColor = {
  background: 'linear-gradient(103.4deg, #2D00D2 12.04%, #2C00D3 30.87%, #3700C8 46.11%, #3E00C0 63.54%, #4B00B4 80.82%, #5400AA 93.76%)',
  color: ' #FFFFFF',
  borderRadius: '10px',
  fontSize: '11px',
  width: 'max-content'
};

const AdviceList = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState<any>([]);
  const [symbols, setSymbols] = useState<any>({
    list: [],
    complete: false
  });
  const cmpRefs = useRef<any>([]);
  const changeRefs = useRef<any>([]);
  const returnPercentageRefs = useRef<any>([]);
  const perLotProfitRefs = useRef<any>([]);
  const { data: productType } = useMaster({ apiUrl: 'product-type' });
  const { data: instrument } = useMaster({ apiUrl: 'instrument' });
  const { data: timeFrame } = useMaster({ apiUrl: 'time-frame' });
  const [page, setPage] = useState<number>(1);
  const [status, setStatus] = useState<any>('');
  const [totalAdvice, setTotalAdvice] = useState<number>(0);
  const [advicerefetch, setadvicerefetch] = useState(false);
  const [statusValue, setStatusValue] = useState('open');
  const [searchText, setSearchText] = useState<string>('');
  const [productCount, setProductCount] = useState<any>();
  const [options, setOptions] = useState<any>([]);
  const [product, setProduct] = useState<any>([]);
  const [searchAccess, setSearchAccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selected, setselected] = useState(true);
  const [openUpdateCard, setopenUpdateCard] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const count = useSelector((state: any) => state.counter);
  const UserLevel = JSON.parse(localStorage.getItem('permission') || '');
  const handleExportClick = async () => {
    setIsExporting(true);
    let url = `${BASE_URL}/advisory/advice-grid/`;
    const query = { page, limit: 2500, statusValue, searchText, product: product[0] };
    const response = await axios.get((url += '?' + qs.stringify(query)));
    const adviceData = response.data.data.map((data: any, index: any) => {
      let change: any;
      let returnPercentage: any;
      let perLotProfit: any;
      if (data.entry) {
        const lowerEntry = +data.entry.split('-')[0];
        const higherEntry = +data.entry.split('-')[0];

        if (data.action === 'buy') {
          change = (+data?.updates[data?.updates.length - 1]?.price - lowerEntry).toFixed(2);
          returnPercentage = `${(((+data?.updates[data?.updates.length - 1]?.price - lowerEntry) / lowerEntry) * 100).toFixed(2)}%`;
          perLotProfit = ((+data?.updates[data?.updates.length - 1]?.price - lowerEntry) * data.lotSize).toFixed(2);
        }
        if (data.action === 'sell') {
          change = (higherEntry - +data?.updates[data?.updates.length - 1]?.price).toFixed(2);
          returnPercentage = `${(((higherEntry - +data?.updates[data?.updates.length - 1]?.price) / higherEntry) * 100).toFixed(2)}%`;
          perLotProfit = ((higherEntry - +data?.updates[data?.updates.length - 1]?.price) * data.lotSize).toFixed(2);
        }
      }
      return {
        _id: data._id,
        createdAt: data.date,
        optionStrike: data.optionStrike,
        optionType: data.optionType,
        lotSize: data.lotSize,
        product: data.product,
        analyst: data.analyst,
        stopLoss: data.stopLoss,
        action: data.action,
        target1: data.target1,
        target2: data.target2,
        target3: data.target3,
        entry: data.entry,
        instrumentName: data.instrument,
        nameOfUnderlying: data.nameOfUnderlying,
        status: data.status,
        cmp: data?.updates[data?.updates.length - 1]?.price,
        change: change,
        returnPercentage: returnPercentage,
        perLotProfit: perLotProfit
      };
    });
    function convertJsonToCsv(jsonData: any) {
      // Get headers from the first object in the array
      const headers = Object.keys(jsonData[0]);

      // Create a CSV string with headers as the first row
      let csvString = headers.join(',') + '\n';

      // Loop through the array and create a new row for each object
      for (const obj of jsonData) {
        const values = [];

        // Loop through the keys in the object and add them to the row
        for (const key of headers) {
          values.push(obj[key]);
        }

        // Add the row to the CSV string
        csvString += values.join(',') + '\n';
      }

      return csvString;
    }

    function downloadCsvFile(csvString: any, filename: any) {
      const link = document.createElement('a');
      link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvString));
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    const csvString = convertJsonToCsv(adviceData);
    downloadCsvFile(csvString, 'data.csv');
    setIsExporting(false);
  };
  const allowSearchbar = async () => {
    const allow = await UserLevel.some((value: any) => value.value === 4);
    if (allow) {
      setSearchAccess(true);
    }
  };
  useEffect(() => {
    if (count !== 0) {
      setopenUpdateCard(true);
    }
  }, [count]);
  useEffect(() => {
    socket.connect();
    allowSearchbar();
  }, []);
  useEffect(() => {
    socket.on('connect_error', (err) => {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Could not connect to socket',
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: true
        })
      );
      setTimeout(() => {
        closeSnackbar();
      }, 2000);
    });
  }, [dispatch]);

  const init = async () => {
    try {
      setLoading(true);
      let url = `${BASE_URL}/advisory/advice-grid/`;
      const query = { page, limit: isExporting ? 2500 : 25, statusValue, searchText, product: product[0] };
      const response = await axios.get((url += '?' + qs.stringify(query)));
      const countresponse = await axios.get(`${BASE_URL}/advisory/productcount`);
      setStatus(countresponse.data?.statusdata);
      setProductCount(countresponse.data?.productCount);
      const res = await axios.get(`${BASE_URL}/advisory/product`);
      const data = (res.data || []).map((item: any) => ({
        label: item['productTitle'],
        value: item._id
      }));
      setOptions(data);
      setSymbols({
        list: [],
        complete: false
      });
      if (response.data.data.length) {
        cmpRefs.current.forEach((item: any) => {
          if (item[Object.keys(item)[0]]) {
            item[Object.keys(item)[0]].textContent = '';
          }
        });
        cmpRefs.current = [];
        changeRefs.current.forEach((item: any) => {
          if (item[Object.keys(item)[0]]) {
            item[Object.keys(item)[0]].textContent = '';
          }
        });
        changeRefs.current = [];
        returnPercentageRefs.current.forEach((item: any) => {
          if (item[Object.keys(item)[0]]) {
            item[Object.keys(item)[0]].textContent = '';
          }
        });
        returnPercentageRefs.current = [];
        perLotProfitRefs.current.forEach((item: any) => {
          if (item[Object.keys(item)[0]]) {
            item[Object.keys(item)[0]].textContent = '';
          }
        });
        perLotProfitRefs.current = [];
        const adviceData = response.data.data.map((data: any, index: any) => {
          setSymbols((prevState: any) => {
            return { list: [...prevState.list, data.trueDataSymbol], complete: index === response.data.data.length - 1 ? true : false };
          });
          let change: any;
          let returnPercentage: any;
          let perLotProfit: any;
          if (data.entry) {
            const lowerEntry = +data.entry.split('-')[0];
            const higherEntry = +data.entry.split('-')[0];

            if (data.action === 'buy') {
              change = (+data.cmp - lowerEntry).toFixed(2);
              returnPercentage = `${(((+data.cmp - lowerEntry) / lowerEntry) * 100).toFixed(2)}%`;
              perLotProfit = ((+data.cmp - lowerEntry) * data.lotSize).toFixed(2);
            }
            if (data.action === 'sell') {
              change = (higherEntry - +data.cmp).toFixed(2);
              returnPercentage = `${(((higherEntry - +data.cmp) / higherEntry) * 100).toFixed(2)}%`;
              perLotProfit = ((higherEntry - +data.cmp) * data.lotSize).toFixed(2);
            }
          }
          return {
            ...data,
            cmp: (
              <span
                ref={(element) => {
                  cmpRefs.current.push({ [data.trueDataSymbol]: element });

                  if (element && !element.textContent) {
                    element.textContent = data.cmp || '';
                  }
                }}
              ></span>
            ),
            change: (
              <span
                ref={(element) => {
                  changeRefs.current.push({ [data.trueDataSymbol]: element });
                  if (element && !element.textContent) {
                    element.textContent = change || '';
                  }
                }}
              ></span>
            ),
            returnPercentage: (
              <span
                ref={(element) => {
                  returnPercentageRefs.current.push({ [data.trueDataSymbol]: element });
                  if (element && !element.textContent) {
                    element.textContent = returnPercentage || '';
                  }
                }}
              >
                {`${data.returnPercentage}%`}
              </span>
            ),
            perLotProfit: (
              <span
                ref={(element) => {
                  perLotProfitRefs.current.push({ [data.trueDataSymbol]: element });
                  if (element && !element.textContent) {
                    element.textContent = perLotProfit || '';
                  }
                }}
              >
                {data.perLotProfit}
              </span>
            )
          };
        });

        setData(adviceData);
        setTotalAdvice(response.data?.pageTotal);
        // setTotalcount(response.data?.total);
      } else {
        setData([]);
      }
    } catch (error) {
      console.log({ error: error });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (symbols.complete) {
      socket.emit('LTP', {
        subscribe: symbols.list,
        unsubscribe: []
      });
    }
  }, [symbols]);

  useEffect(() => {
    socket.on('LTP', (socketData: any) => {
      cmpRefs.current.forEach((item: any) => {
        if (item[socketData.Symbol]) {
          item[socketData.Symbol].textContent = socketData.LTP;
        }
      });
      const currentAdvice = data.find((advice: any) => {
        return advice.trueDataSymbol === socketData.Symbol;
      });
      if (currentAdvice && currentAdvice.entry) {
        const lowerEntry = +currentAdvice.entry.split('-')[0];
        const higherEntry = +currentAdvice.entry.split('-')[0];
        if (currentAdvice.action === 'buy') {
          changeRefs.current.forEach((item: any) => {
            if (item[socketData.Symbol]) {
              item[socketData.Symbol].textContent = (+socketData.LTP - lowerEntry).toFixed(2);
            }
          });
          returnPercentageRefs.current.forEach((item: any) => {
            if (item[socketData.Symbol]) {
              item[socketData.Symbol].textContent = `${(((+socketData.LTP - lowerEntry) / lowerEntry) * 100).toFixed(2)}%`;
            }
          });
          perLotProfitRefs.current.forEach((item: any) => {
            if (item[socketData.Symbol]) {
              item[socketData.Symbol].textContent = ((+socketData.LTP - lowerEntry) * currentAdvice.lotSize).toFixed(2);
            }
          });
        }
        if (currentAdvice.action === 'sell') {
          changeRefs.current.forEach((item: any) => {
            if (item[socketData.Symbol]) {
              item[socketData.Symbol].textContent = (higherEntry - +socketData.LTP).toFixed(2);
            }
          });
          returnPercentageRefs.current.forEach((item: any) => {
            if (item[socketData.Symbol]) {
              item[socketData.Symbol].textContent = `${(((higherEntry - +socketData.LTP) / higherEntry) * 100).toFixed(2)}%`;
            }
          });
          perLotProfitRefs.current.forEach((item: any) => {
            if (item[socketData.Symbol]) {
              item[socketData.Symbol].textContent = ((higherEntry - +socketData.LTP) * currentAdvice.lotSize).toFixed(2);
            }
          });
        }
      }
    });
  }, [cmpRefs, changeRefs, returnPercentageRefs, perLotProfitRefs, data]);

  useEffect(() => {
    init();
  }, [page, statusValue, searchText, product, socket, advicerefetch]);

  const handlePageChange = (p: number) => {
    setPage(p);
  };
  const onItemChange = (e: any, value: any) => {
    value && setProduct(value.map((x: any) => x.label));
  };
  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <Box display="flex" flexDirection="column">
      {(!data || loading) && <Loader />}
      <Box display="flex" justifyContent="flex-end">
        <Button sx={{ position: 'absolute', top: 0 }} href={`/advice-create`} variant="contained" color="primary">
          Create Advice
        </Button>
      </Box>
      <Box sx={{ position: 'relative' }}>
        <Stack direction="row" spacing={2} sx={{ marginBottom: '10px', position: 'absolute', left: '100px', bottom: '-25px' }}>
          {searchAccess && (
            <>
              <Button
                sx={bgColor}
                onClick={() => setStatusValue('freshTrade')}
                disabled={statusValue === 'freshTrade' ? true : false}
              >{`Fresh Trade  (${status?.freshTrade || ''})`}</Button>
              <Button
                sx={bgColor}
                onClick={() => setStatusValue('bookProfit')}
                disabled={statusValue === 'bookProfit' ? true : false}
              >{`Book Profit  (${status?.bookProfit || ''} )`}</Button>
              <Button
                sx={bgColor}
                onClick={() => setStatusValue('stoplossTriggered')}
                disabled={statusValue === 'stoplossTriggered' ? true : false}
              >{`StopLoss Trigged  (${status?.stoplossTriggered})`}</Button>
              <Button sx={bgColor} onClick={() => setStatusValue('open')} disabled={statusValue === 'open' ? true : false}>{`Open (${
                status?.open || ''
              })`}</Button>
              <Button
                sx={bgColor}
                onClick={() => setStatusValue('bookPartialProfit')}
                disabled={statusValue === 'bookPartialProfit' ? true : false}
              >{`Book Partial Profit (${status?.bookPartialProfit || ''})`}</Button>
              <Button sx={bgColor} onClick={() => setStatusValue('exit')} disabled={statusValue === 'exit' ? true : false}>{`Exit (${
                status?.exit || ''
              })`}</Button>
              <Button sx={bgColor} onClick={() => setStatusValue('')} disabled={statusValue === '' ? true : false}>{`Total Advice (${
                status?.alladvice || ''
              })`}</Button>
              {searchAccess && (
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
                      {option.label}({productCount?.[option.label]})
                    </Box>
                  )}
                />
              )}
            </>
          )}
        </Stack>
        {/* <Box sx={{ position: 'absolute', right: 0 }}>
          <SearchInput onChange={setSearchText} />
        </Box> */}
      </Box>
      <Stack direction="row" gap={1}>
        <Box width="70%">
          {data && !loading && (
            <>
              <Stack direction="row" spacing={2} sx={{ position: 'absolute', right: 0 }}>
                <Button sx={bgColor} onClick={handleExportClick} disabled={isExporting}>
                  {isExporting ? 'Exporting...' : 'Export CSV'}
                </Button>
              </Stack>
              <BasicTable
                onRowClick
                columns={columns({ productType, instrument, timeFrame })}
                getHeaderProps={(column: any) => column.getSortByToggleProps()}
                data={data}
                currentPage={page}
                totalPage={totalAdvice}
                onPageChange={handlePageChange}
                striped
                advicetable={true}
              />
            </>
          )}
        </Box>
        {!openUpdateCard && (
          <Button
            sx={{
              position: 'absolute',
              right: '0px',
              top: '200px',
              background:
                'linear-gradient(103.4deg, #2D00D2 12.04%, #2C00D3 30.87%, #3700C8 46.11%, #3E00C0 63.54%, #4B00B4 80.82%, #5400AA 93.76%)',
              color: ' #FFFFFF',
              borderRadius: '10px',
              fontSize: '11px',
              width: 'max-content'
            }}
            onClick={() => setopenUpdateCard(!openUpdateCard)}
          >
            Update Advice
          </Button>
        )}
        <Stack direction="column" position="fixed" right={10} sx={{ width: `${openUpdateCard ? '50vh' : '0vh'}`, transition: 'width 1s' }}>
          <Box
            sx={{
              boxShadow: 2,
              borderTopRightRadius: '20px',
              borderTopLeftRadius: '20px',
              height: '29vh',
              marginTop: '40px',
              overflow: 'auto',
              backgroundColor: '#ffffff'
            }}
          >
            {/* {selected ? (
              <AdviceDetailForm advice={data[count]} />
            ) : (
             
            )} */}
            {/* {selected && (
              <>
                <Box sx={{ position: 'relative', marginTop: '30px' }}>
                  <Tooltip title="Update Advice Status">
                    <IconButton
                      onClick={() => setselected(!selected)}
                      sx={{ borderRadius: '50%', background: '#E9ECFF', position: 'absolute', right: '50%', top: '-15px' }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </>
            )} */}
            <UpdateChatAdviceStatus
              setadvicerefetch={setadvicerefetch}
              setselected={setopenUpdateCard}
              selected={selected}
              advice={data[count]}
            />
          </Box>
          <Box
            sx={{
              boxShadow: 2,
              borderBottomRightRadius: '20px',
              borderBottomLeftRadius: '20px',
              maxHeight: '35vh',
              background: 'linear-gradient(to right bottom, #FBFBFF, #E9ECFF)'
            }}
          >
            <AdviceChat advice={data[count]} />
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default AdviceList;
