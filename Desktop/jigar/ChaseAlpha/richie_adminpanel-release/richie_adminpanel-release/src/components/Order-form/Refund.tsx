import React from 'react'
import { InputLabel, Stack, TextField } from '@mui/material';
const styles = { width: "100px", height: "30px" }

const Refund = ({ formik }: any) => {
    const { values } = formik
    return (
        <div> <Stack direction="row">
            <InputLabel sx={{ width: "96%", p: 1 }}>Amount already refunded :</InputLabel>
            <TextField type="number" name="alreadyrefund" value={values.alreadyrefund} onChange={formik.handleChange} sx={styles} />
        </Stack>
            <Stack direction="row">
                <InputLabel sx={{ width: "96%", p: 1 }}>Total available to refund :</InputLabel>
                <TextField type="number" name="availablerefund" value={values.availablerefund} onChange={formik.handleChange} sx={styles} />
            </Stack>
            <Stack direction="row">
                <InputLabel sx={{ width: "96%", p: 1 }}>Refund amount :</InputLabel>
                <TextField type="number" name="refundamount" value={values.refundamount} onChange={formik.handleChange} sx={styles} />
            </Stack>
            <Stack direction="row">
                <InputLabel sx={{ width: "96%", p: 1, }}>Reason for refund (optional) :</InputLabel>
                <TextField type="text" name="refundreason" value={values.refundreason} onChange={formik.handleChange} sx={styles} />
            </Stack>
        </div>
    )
}

export default Refund