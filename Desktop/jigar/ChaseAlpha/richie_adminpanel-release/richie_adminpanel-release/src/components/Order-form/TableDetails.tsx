import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Box, } from '@mui/system';
import { Divider, IconButton, InputLabel, Stack, TextField } from '@mui/material';
import { Button } from '@mui/material';
import Autocomplete from 'components/AutoComplete';
import { BASE_URL } from 'config';
import axios from 'utils/axios';
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';
import Refund from './Refund';



const styles = { width: "100px", height: "30px" }

export default function TableDetails({ formik, setProductValue, productValue, defaultState }: any) {
    const [options, setOptions] = React.useState<any>([]);
    const [refundStatus, setRefundStatus] = React.useState<boolean>(false)
    const [isrefunded, setIsrefunded] = React.useState<boolean>(false)

    const buttonBackgroud = "linear-gradient(103.4deg, #2D00D2 12.04%, #2C00D3 30.87%, #3700C8 46.11%, #3E00C0 63.54%, #4B00B4 80.82%, #5400AA 93.76%)"

    const initSearchItem = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/advisory/product`);
            const data = (response.data || []).map((item: any) => ({
                label: item["productTitle"], value: item._id, plans: item.subscriptionPlanIds
            }));
            setOptions(data);
        } catch (error) {
            console.log({ error: error });
        }
    };
    const { values } = formik
    function createData(
        name: string,
        Cost: number,
        Oty: number,
        Total: number,
        GST: number,
        index: number
    ) { 
        return { name, Cost, Oty, Total, GST, index };
    }
    let rows = [createData(values?.advisoryId?.productTitle, values?.listAmount, 1, values?.totalAmount, values?.listGst, 1)]

    if (productValue.plans) {
        rows = productValue.plans.map((x: any, index: number) => {
            values.listAmount = x.actualPrice
            values.listGst = x.actualPrice * 0.18
            values.totalAmount = x.actualPrice + x.actualPrice * 0.18
            values.subscriptionId = x._id
            values.advisoryId = productValue.value
            return createData(productValue.label, x.actualPrice, 1, x.actualPrice + x.actualPrice * 0.18, x.actualPrice * 0.18, index)
        })

    }
    if (values?.programSessions?.length > 0) {
        rows = values.programSessions.map((x: any) => createData(x.sessionName || '-', x.basePricePerSession || "-", 1, x.basePricePerSession, x.GST, 1))
    }


    const onItemChange = (event: any, value: any) => {
        setProductValue(value)

    };

    function handleDelete(rowIndex: number): void {
        let list = [...productValue.plans];
        list.splice(rowIndex, 1)
        console.log(list);
        setProductValue({
            ...productValue,
            plans: list
        });

    }
    React.useEffect(() => {
        initSearchItem()
    }, []);

    return (<>
        <TableContainer sx={{ mt: 2 }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead sx={{ background: "#ECEFFF", borderTopRightRadius: "15px", borderTopLeftRadius: "15px" }}>
                    <TableRow>
                        <TableCell>Products</TableCell>
                        <TableCell align="right">Cost</TableCell>
                        <TableCell align="right">Qty</TableCell>
                        <TableCell align="right">IGST 18%</TableCell>
                        <TableCell align="right">Total</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row: any) => (
                        <TableRow
                            key={row.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {
                                    row.name ? row.name : <Autocomplete
                                        name="nameOfUnderlying"
                                        value={productValue}
                                        clearOnBlur
                                        disableCloseOnSelect={false}
                                        onChange={onItemChange}
                                        options={options}
                                        sx={{ flex: 1, bgcolor: "#F0EFEF", mt: 1 }}
                                    />
                                }
                            </TableCell>
                            <TableCell align="right"><TextField type="number" name='listAmount' value={row.Cost} onChange={formik.handleChange} sx={styles} /></TableCell>
                            <TableCell align="right"><TextField type="number" name="numberOfSessions" value={row.Oty} onChange={formik.handleChange} sx={styles} /></TableCell>
                            <TableCell align="right"><TextField type="number" name="listGst" value={row.GST} onChange={formik.handleChange} sx={styles} /></TableCell>
                            <TableCell align="right"><TextField type="number" name="totalAmount" value={row.Total} onChange={formik.handleChange} sx={styles} /></TableCell>
                            <TableCell align='right'><IconButton onClick={() => handleDelete(row.index)}><DoDisturbOnIcon sx={{ color: "red" }} /></IconButton></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        <Box >
            <Stack direction="column" spacing={1} sx={{ background: "white", p: 2, mt: 1 }}>
                {refundStatus ? <Refund formik={formik} />
                    : <>
                        <Stack direction="row">
                    <InputLabel sx={{ width: "96%", p: 1 }}>Product SubTotal :</InputLabel>
                    <TextField type="number" name="listAmount" value={values.listAmount || "-"} onChange={formik.handleChange} sx={styles} />
                </Stack>
                <Stack direction="row">
                    <InputLabel sx={{ width: "96%", p: 1 }}>IGST 18% :</InputLabel>
                    <TextField type="number" name="listGst" value={values.listGst || "-"} onChange={formik.handleChange} sx={styles} />
                </Stack>
                <Stack direction="row">
                    <InputLabel sx={{ width: "96%", p: 1 }}>Order Total :</InputLabel>
                    <TextField type="number" name="totalAmount" value={values.totalAmount || "-"} onChange={formik.handleChange} sx={styles} />
                        </Stack>
                    </>}
                <Divider sx={{ border: "1px solid #CCD3FF" }} />
                <Stack direction="row">
                    <InputLabel sx={{ width: "96%", fontSize: "1rem ", fontWeight: 700, p: 1 }}>paid</InputLabel>
                    <TextField type="number" name="amount_paid" value={values.amount_paid || "-"} onChange={formik.handleChange} sx={styles} />
                </Stack>
                <Divider sx={{ border: "1px solid #CCD3FF" }} />
                {defaultState && <Stack direction="row" spacing={2}>
                    <Box sx={{ flex: 1 }}>
                        {isrefunded ? <>
                            <Stack direction="row">
                                <InputLabel sx={{ width: "94%", fontSize: "1rem ", fontWeight: 700, p: 1, color: 'red' }}>Refunded</InputLabel>
                                <InputLabel sx={{ fontSize: "1rem ", fontWeight: 700, p: 1 }}>{values?.amount_paid}</InputLabel>
                            </Stack>
                            <Stack direction="row">
                                <InputLabel sx={{ width: "94%", fontSize: "1rem ", fontWeight: 700, p: 1 }}>Net Payment</InputLabel>
                                <InputLabel sx={{ fontSize: "1rem ", fontWeight: 700, p: 1 }}>0</InputLabel>
                            </Stack>
                        </> : <Button sx={{ width: '100px', fontSize: "14px", color: '#2D00D2', border: "1px solid #2D00D2", borderRadius: '10px' }}
                            onClick={() => setRefundStatus(!refundStatus)}>
                            {refundStatus ? "Cancel" : "REFUND"}
                        </Button>}
                    </Box>
                    {defaultState && refundStatus && <>
                        <Button sx={{ color: 'white', background: `${buttonBackgroud}`, width: '250px', height: '40px', fontSize: '16px', fontWeight: '700' }}
                            onClick={() => {
                                setRefundStatus(!refundStatus)
                                setIsrefunded(!isrefunded)
                                values.status = "refunded"
                            }}>
                            {`Refund rs.${values?.amount_paid} manually`}
                        </Button>
                        <Button sx={{ color: 'white', background: `${buttonBackgroud}`, width: '300px', height: '40px', fontSize: '16px', fontWeight: '700' }}
                            onClick={() => {
                                setRefundStatus(!refundStatus)
                                setIsrefunded(!isrefunded)
                                values.status = "refunded"
                            }}>
                            {`Refund rs.${values?.amount_paid} via Razorpay`}
                        </Button>
                    </>}
                </Stack>}
            </Stack>
        </Box>
    </>
    );
}