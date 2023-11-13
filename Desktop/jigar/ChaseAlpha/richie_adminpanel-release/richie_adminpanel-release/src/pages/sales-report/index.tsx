import React, { useEffect } from 'react';
import axios from 'utils/axios';
import DateRangePicker from './DateRange';
import { BASE_URL } from 'config';
import { useState } from 'react';
import { columns } from './constant';
import BasicTable from '../../components/react-table/BasicTable';
import { Stack, Button } from '@mui/material';
const bgColor = {
  background: 'linear-gradient(103.4deg, #2D00D2 12.04%, #2C00D3 30.87%, #3700C8 46.11%, #3E00C0 63.54%, #4B00B4 80.82%, #5400AA 93.76%)',
  color: ' #FFFFFF',
  borderRadius: '10px'
};
const SalesReport = () => {
  const [data, setData] = useState<any>({});
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [attemptedOrderLoading, setAttemptedOrderLoading] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [limit, setLimit] = useState<number>(10000);

  const handleDateRangeChange = async () => {
    if (loading) {
      try {
        const params: any = {
          page,
          limit: limit,
          startDate,
          endDate
        };
        const response = await axios.get(`${BASE_URL}/admin/sales-report?${new URLSearchParams(params).toString()}`);
        setData(response.data || []);
        setLimit(response?.data?.limit);
      } catch (error) {
        console.log({ error: error });
      }
      setLimit(10);
    }
    if (attemptedOrderLoading) {
      try {
        const params: any = {
          page,
          limit: limit,
          startDate,
          endDate
        };
        const response = await axios.get(`${BASE_URL}/admin/sales-report/attemptedorders?${new URLSearchParams(params).toString()}`);
        setData(response.data.result || []);
        setLimit(response?.data?.limit);
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    handleDateRangeChange();
  }, [loading, page, attemptedOrderLoading]);

  const handlePageChange = (page: number) => {
    setPage(page);
  };
  const handleExportClick = () => {
    setIsExporting(true);
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
    const csvString = convertJsonToCsv(data.items);
    downloadCsvFile(csvString, 'data.csv');
  };

  return (
    <>
      {
        <>
          <Stack direction="row-reverse" spacing={2}>
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              setLoading={setLoading}
              setattempted={setAttemptedOrderLoading}
            />
          </Stack>
        </>
      }
      {data.items && (
        <>
          <Stack direction="row" spacing={2} sx={{ position: 'absolute', right: 0 }}>
            <Button sx={bgColor} onClick={handleExportClick} disabled={isExporting}>
              {isExporting ? 'Exporting...' : 'Export CSV'}
            </Button>
          </Stack>
          <BasicTable
            columns={columns()}
            getHeaderProps={(column: any) => column.getSortByToggleProps()}
            data={data.items}
            currentPage={data.page}
            totalPage={data.pageTotal}
            onPageChange={handlePageChange}
            limit={limit}
          />
        </>
      )}
    </>
  );
};

export default SalesReport;
