import React from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Button, Divider, Paper, InputLabel, Stack, TextField, Typography } from '@mui/material';
import moment from 'moment';
const buttonBackgroud = "linear-gradient(103.4deg, #2D00D2 12.04%, #2C00D3 30.87%, #3700C8 46.11%, #3E00C0 63.54%, #4B00B4 80.82%, #5400AA 93.76%)"


const PaymentDetails = ({ formik }: any) => {
    const { values } = formik
    const [expanded, setExpanded] = React.useState<string | false>(false);
    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };
    return (
        <>
            <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')} sx={{ border: "none", mt: 1 }}>
                <AccordionSummary
                    sx={{ background: "#ECEFFF", borderBottomRightRadius: "15px", borderBottomLeftRadius: "15px", border: "none" }}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel4bh-content"
                    id="panel4bh-header"
                >
                    <Typography variant='h4'>Payment Details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Paper elevation={0} sx={{
                        width: "100%", border: '1px solid #CCD3FF', borderRadius: "10px"
                    }}>
                        <Typography sx={{ p: 1 }} variant="h5">Invoices</Typography>
                        <Divider sx={{ border: '1px solid #CCD3FF' }} />
                        <Stack direction="column" sx={{ position: 'relative' }}>
                            <Stack direction="row" sx={{ p: 1 }}>
                                <InputLabel sx={{ p: 1 }}>RazorPayOrder Id :</InputLabel>
                                {/* <Typography sx={{ ml: 1 }}>{values.orderId}</Typography> */}
                                {/* <TextField name='orderId' value={values?.payments?.[0].order_id} type="text" onChange={(e) => formik.setFieldValue('orderId', e.target.value)} /> */}
                                <Typography sx={{ p: 1 }}>{values?.razorPayOrderId}</Typography>
                            </Stack>
                            <Stack direction="row" sx={{ p: 1 }}>
                                <InputLabel>Invoice Date :</InputLabel>
                                <Typography sx={{ ml: 1 }}>{moment(values?.created_at ? values.created_at : new Date).format("MMMM Do YYYY, h:mm:ss a")}</Typography>
                            </Stack>
                        </Stack>


                    </Paper>
                </AccordionDetails>
            </Accordion>
        </>
    )
}

export default PaymentDetails