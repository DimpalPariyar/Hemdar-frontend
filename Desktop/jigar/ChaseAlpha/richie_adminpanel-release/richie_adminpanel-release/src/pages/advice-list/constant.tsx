// material-ui
import { Chip, IconButton, MenuItem, SelectChangeEvent, TextField, Tooltip } from '@mui/material';
import { format, startOfDay, addDays } from 'date-fns';
import SelectField from 'components/SelectField';
import { SendOutlined } from '@ant-design/icons';
import DatePicker from 'components/DatePicker';
import { useSelector, useDispatch } from 'react-redux';
import { adviceValue } from 'store/reducers/adviceCounter';
import { Button } from '@mui/material';
import { useState } from 'react';
import axios from '../../utils/axios';
import { BASE_URL } from '../../config';
import EditIcon from '@mui/icons-material/Edit';
const updateAdviceData = async (adviceId: any, data: any) => {
  try {
    const response = await axios.patch(`${BASE_URL}/advisory/advice-update/${adviceId}`, data);
    if (response.data) {
      alert(response.data.message);
    }
  } catch (error) {}
};

export const adviceStatus = [
  {
    value: 0,
    label: 'All'
  },
  {
    value: 1,
    label: 'Fresh'
  },
  {
    value: 2,
    label: 'Book Profit'
  },
  {
    value: 3,
    label: 'Exit'
  },
  {
    value: 4,
    label: 'Stoploss Triggered'
  },
  {
    value: 4,
    label: 'Open'
  }
];

export const columns = ({ productType, instrument, timeFrame }: any) => {
  return [
    // {
    //   Header: 'Update',
    //   className: 'cell-right',
    //   disableSortBy: true,
    //   Cell: ({ row }: any) => {
    //     const dispatch = useDispatch();
    //     return (
    //       <Tooltip title="Update">
    //         <IconButton
    //           color="secondary"
    //           //  href={`/advice-update/${row.original._id}`}
    //           onClick={() => dispatch(adviceValue(row.index))}
    //         >
    //           <SendOutlined />
    //         </IconButton>
    //       </Tooltip>
    //     );
    //   }
    // },
    {
      Header: 'Date',
      style: {
        width: 150
      },
      accessor: ({ date }: any) =>
        date ? (
          <>
            <p>{format(new Date(date), 'dd MMM yyyy')}</p>
            {format(new Date(date), 'hh:mm:ss a')}
          </>
        ) : (
          'NA'
        ),
      Filter: ({ column: { filterValue, setFilter } }: any) => {
        return <DatePicker value={filterValue || null} onChange={(date: any) => setFilter(date)} />;
      },
      filter: (rows: any, id: any, filterValue: any) => {
        return rows.filter((row: any) => {
          if (!filterValue || isNaN(Number(filterValue))) return true;
          const rowDate = row.original.date;
          if (!rowDate) return false;
          const formattedDate = new Date(rowDate).toISOString().substring(0, 10);
          const formattedFilter = addDays(startOfDay(filterValue), 1).toISOString().substring(0, 10);
          return formattedDate === formattedFilter;
        });
      }
    },
    // {
    //   Header: 'Time',
    //   disableFilters: true,
    //   accessor: ({ date }: any) => (date ? format(new Date(date), 'hh:mm:ss a') : 'NA')
    // },
    {
      Header: 'Name of Underlying',
      // accessor: ({ nameOfUnderlying = '' }: any) => `${nameOfUnderlying}`,
      filter: (rows: any, id: any, filterValue: any) => {
        return rows.filter((row: any) => {
          if (!filterValue) return true;
          const values = [row.original.nameOfUnderlying];
          return values.some((value = '') => value.toLowerCase().includes(filterValue?.toLowerCase()));
        });
      },
      Cell: ({ cell }: any) => {
        const [changedvalue, setchangedvalue] = useState(cell.row.original.nameOfUnderlying);
        const [onfocused, setonfocused] = useState(false);
        return (
          <>
            {/* {cell.row.original.nameOfUnderlying} */}
            {
              <input
                value={changedvalue}
                style={{
                  fontSize: 'inherit',
                  color: 'inherit',
                  width: '70px',
                  border: 'none',
                  backgroundColor: 'transparent'
                }}
                onFocus={() => setonfocused(true)}
                onChange={(e: any) => setchangedvalue(e.target.value)}
              />
            }
            {onfocused && (
              <Tooltip title="Update">
                <IconButton onClick={() => updateAdviceData(cell.row.original._id, { nameOfUnderlying: changedvalue })}>
                  <EditIcon sx={{ fontSize: 'inherit', color: 'white' }} />
                </IconButton>
              </Tooltip>
            )}
          </>
        );
      }
    },
    {
      Header: 'OPTION STRIKE',
      accessor: 'optionStrike',
      Cell: ({ cell }: any) => {
        const [changedvalue, setchangedvalue] = useState(cell.row.original.optionStrike);
        const [onfocused, setonfocused] = useState(false);
        return (
          <>
            {/* {cell.row.original.optionStrike} */}
            {
              <input
                value={changedvalue}
                style={{
                  fontSize: 'inherit',
                  color: 'inherit',
                  width: '30px',
                  border: 'none',
                  backgroundColor: 'transparent'
                }}
                onFocus={() => setonfocused(true)}
                onChange={(e: any) => setchangedvalue(e.target.value)}
              />
            }
            {onfocused && (
              <Tooltip title="Update">
                <IconButton onClick={() => updateAdviceData(cell.row.original._id, { optionStrike: changedvalue })}>
                  <EditIcon sx={{ fontSize: 'inherit', color: 'white' }} />
                </IconButton>
              </Tooltip>
            )}
          </>
        );
      }
    },
    {
      Header: 'OPTION TYPE',
      accessor: 'optionType',
      Cell: ({ cell }: any) => {
        const [changedvalue, setchangedvalue] = useState(cell.row.original.optionType);
        const [onfocused, setonfocused] = useState(false);
        return (
          <>
            {/* {cell.row.original.optionType} */}
            {
              <input
                value={changedvalue}
                style={{
                  fontSize: 'inherit',
                  color: 'inherit',
                  width: '25px',
                  border: 'none',
                  backgroundColor: 'transparent'
                }}
                onFocus={() => setonfocused(true)}
                onChange={(e: any) => setchangedvalue(e.target.value)}
              />
            }
            {onfocused && (
              <Tooltip title="Update">
                <IconButton onClick={() => updateAdviceData(cell.row.original._id, { optionType: changedvalue })}>
                  <EditIcon sx={{ fontSize: 'inherit', color: 'white' }} />
                </IconButton>
              </Tooltip>
            )}
          </>
        );
      }
    },
    {
      Header: 'Product Type',
      accessor: ({ productType }: any) => productType,
      Filter: ({ column: { filterValue = 0, setFilter } }: any) => {
        const handleChange = (event: SelectChangeEvent) => {
          setFilter(event.target.value as string);
        };
        return (
          <SelectField
            defaultValue={<MenuItem value={0}>All</MenuItem>}
            valueKey="name"
            labelKey="name"
            options={productType}
            value={filterValue}
            onChange={handleChange}
          />
        );
      }
    },
    {
      Header: 'Time Frame',
      accessor: 'timeFrame',
      Filter: ({ column: { filterValue = 0, setFilter } }: any) => {
        const handleChange = (event: SelectChangeEvent) => {
          setFilter(event.target.value as string);
        };
        return (
          <SelectField
            defaultValue={<MenuItem value={0}>All</MenuItem>}
            valueKey="name"
            labelKey="name"
            options={timeFrame}
            value={filterValue}
            onChange={handleChange}
          />
        );
      }
    },
    {
      Header: 'Instrument',
      Filter: ({ column: { filterValue = 0, setFilter } }: any) => {
        const handleChange = (event: SelectChangeEvent) => {
          setFilter(event.target.value as string);
        };
        return (
          <SelectField
            defaultValue={<MenuItem value={0}>All</MenuItem>}
            valueKey="name"
            labelKey="name"
            options={instrument}
            value={filterValue}
            onChange={handleChange}
          />
        );
      },
      accessor: ({ instrument }: any) => instrument
    },
    {
      Header: 'Product',
      disableFilters: true,
      accessor: 'product'
    },
    // {
    //   Header: 'Analyst',
    //   accessor: 'analyst'
    // },
    {
      Header: 'Entry',
      disableFilters: true,
      accessor: 'entry',
      Cell: ({ cell }: any) => {
        const [changedvalue, setchangedvalue] = useState(cell.row.original.entry);
        const [onfocused, setonfocused] = useState(false);
        return (
          <>
            {/* {cell.row.original.stopLoss} */}
            {
              <input
                value={changedvalue}
                style={{
                  fontSize: 'inherit',
                  color: 'inherit',
                  width: '60px',
                  border: 'none',
                  backgroundColor: 'transparent'
                }}
                onFocus={() => setonfocused(true)}
                onChange={(e: any) => setchangedvalue(e.target.value)}
              />
            }
            {onfocused && (
              <Tooltip title="Update">
                <IconButton
                  onClick={() =>
                    updateAdviceData(cell.row.original._id, {
                      entry: changedvalue
                    })
                  }
                >
                  <EditIcon sx={{ fontSize: 'inherit', color: 'white' }} />
                </IconButton>
              </Tooltip>
            )}
          </>
        );
      }
    },
    {
      Header: 'CMP',
      disableFilters: true,
      accessor: ({ cmp, status, updates }: any) =>
        status === 'open' || status === 'bookPartialProfit' ? cmp : updates[updates?.length - 1]?.price
    },
    {
      Header: 'SL',
      disableFilters: true,
      accessor: 'stopLoss',
      Cell: ({ cell }: any) => {
        const [changedvalue, setchangedvalue] = useState(cell.row.original.stopLoss);
        const [onfocused, setonfocused] = useState(false);
        return (
          <>
            {/* {cell.row.original.stopLoss} */}
            {
              <input
                value={changedvalue}
                style={{
                  fontSize: 'inherit',
                  color: 'inherit',
                  width: '25px',
                  border: 'none',
                  backgroundColor: 'transparent'
                }}
                onFocus={() => setonfocused(true)}
                onChange={(e: any) => setchangedvalue(e.target.value)}
              />
            }
            {onfocused && (
              <Tooltip title="Update">
                <IconButton onClick={() => updateAdviceData(cell.row.original._id, { stopLoss: changedvalue })}>
                  <EditIcon sx={{ fontSize: 'inherit', color: 'white' }} />
                </IconButton>
              </Tooltip>
            )}
          </>
        );
      }
    },
    {
      Header: 'T1',
      disableFilters: true,
      accessor: 'target1',
      Cell: ({ cell }: any) => {
        const [changedvalue, setchangedvalue] = useState(cell.row.original.target1);
        const [onfocused, setonfocused] = useState(false);
        return (
          <>
            {/* {cell.row.original.target1} */}
            {
              <input
                value={changedvalue}
                style={{
                  fontSize: 'inherit',
                  color: 'inherit',
                  width: '25px',
                  border: 'none',
                  backgroundColor: 'transparent'
                }}
                onFocus={() => setonfocused(true)}
                onChange={(e: any) => setchangedvalue(e.target.value)}
              />
            }
            {onfocused && (
              <Tooltip title="Update">
                <IconButton onClick={() => updateAdviceData(cell.row.original._id, { target1: changedvalue })}>
                  <EditIcon sx={{ fontSize: 'inherit', color: 'white' }} />
                </IconButton>
              </Tooltip>
            )}
          </>
        );
      }
    },
    {
      Header: 'T2',
      disableFilters: true,
      accessor: 'target2',
      Cell: ({ cell }: any) => {
        const [changedvalue, setchangedvalue] = useState(cell.row.original.target2);
        const [onfocused, setonfocused] = useState(false);
        return (
          <>
            {/* {cell.row.original.target2} */}
            {
              <input
                value={changedvalue}
                style={{
                  fontSize: 'inherit',
                  color: 'inherit',
                  width: '25px',
                  border: 'none',
                  backgroundColor: 'transparent'
                }}
                onFocus={() => setonfocused(true)}
                onChange={(e: any) => setchangedvalue(e.target.value)}
              />
            }
            {onfocused && (
              <Tooltip title="Update">
                <IconButton onClick={() => updateAdviceData(cell.row.original._id, { target2: changedvalue })}>
                  <EditIcon sx={{ fontSize: 'inherit', color: 'white' }} />
                </IconButton>
              </Tooltip>
            )}
          </>
        );
      }
    },
    {
      Header: 'T3',
      disableFilters: true,
      accessor: 'target3',
      Cell: ({ cell }: any) => {
        const [changedvalue, setchangedvalue] = useState(cell.row.original.target3);
        const [onfocused, setonfocused] = useState(false);
        return (
          <>
            {/* {cell.row.original.target3} */}
            {
              <input
                value={changedvalue}
                style={{
                  fontSize: 'inherit',
                  color: 'inherit',
                  width: '25px',
                  border: 'none',
                  backgroundColor: 'transparent'
                }}
                onFocus={() => setonfocused(true)}
                onChange={(e: any) => setchangedvalue(e.target.value)}
              />
            }
            {onfocused && (
              <Tooltip title="Update">
                <IconButton onClick={() => updateAdviceData(cell.row.original._id, { target3: changedvalue })}>
                  <EditIcon sx={{ fontSize: 'inherit', color: 'white' }} />
                </IconButton>
              </Tooltip>
            )}
          </>
        );
      }
    },
    {
      Header: '% Return',
      disableFilters: true,
      accessor: ({ status, updates, returnPercentage, entry, action }: any) => {
        const lowerEntry = +entry.split('-')[0];
        const higherEntry = +entry.split('-')[0];
        return status === 'open' || status === 'bookPartialProfit' ? (
          returnPercentage
        ) : (
          <>
            {action === 'buy' && `${(((updates?.price - lowerEntry) / lowerEntry) * 100).toFixed(2)}%`}
            {action === 'sell' && `${(((higherEntry - updates?.price) / higherEntry) * 100).toFixed(2)}%`}
          </>
        );
      }
    },
    {
      Header: 'Change',
      disableFilters: true,
      accessor: ({ status, updates, change, entry, action }: any) => {
        const lowerEntry = +entry.split('-')[0];
        const higherEntry = +entry.split('-')[0];
        return status === 'open' || status === 'bookPartialProfit' ? (
          change
        ) : (
          <>
            {action === 'buy' && (+updates?.price - lowerEntry).toFixed(2)}
            {action === 'sell' && (higherEntry - +updates?.price).toFixed(2)}
          </>
        );
      }
    },
    {
      Header: 'Per Lot Profit',
      disableFilters: true,
      accessor: ({ status, updates, perLotProfit, entry, action, lotSize }: any) => {
        const lowerEntry = +entry.split('-')[0];
        const higherEntry = +entry.split('-')[0];
        return status === 'open' || status === 'bookPartialProfit' ? (
          perLotProfit
        ) : (
          <>
            {action === 'buy' && ((+updates?.price - lowerEntry) * lotSize).toFixed(2)}
            {action === 'sell' && ((higherEntry - +updates?.price) * lotSize).toFixed(2)}
          </>
        );
      }
    },
    {
      Header: 'Status',
      accessor: ({ status }: any) => {
        const value = status;
        if (!value) return null;

        switch (value) {
          case 'Fresh Trade':
            return <Chip color="success" label={status} size="small" variant="light" />;
          case 'Exit':
            return <Chip color="error" label={status} size="small" variant="light" />;
          case 'Open':
            return <Chip color="secondary" label={status} size="small" variant="light" />;
          case 'Stoploss Triggered':
            return <Chip color="error" label={status} size="small" variant="light" />;
          case 'Book Profit':
          default:
            return <Chip sx={{ width: '60px' }} color="warning" label={status || 'Not Active'} size="small" variant="light" />;
        }
      },
      Filter: ({ column: { filterValue = 0, setFilter } }: any) => {
        const handleChange = (event: SelectChangeEvent) => {
          setFilter(event.target.value as string);
        };

        return <SelectField options={adviceStatus} value={filterValue} onChange={handleChange} />;
      },
      filter: (rows: any, id: any, filterValue: any) => {
        return rows.filter((row: any) => {
          if (!filterValue) return true;
          return row.original.status.value === filterValue;
        });
      }
    }
  ];
};
