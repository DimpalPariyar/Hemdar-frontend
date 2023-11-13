// material-ui
import { Button, FormControl, InputBase, InputLabel, MenuItem, Select, Stack } from '@mui/material';
import { useFormik } from 'formik';
import { basicInfoSet, dropdownSet, initialValues } from './constant';
import axios from 'utils/axios';
import { BASE_URL } from 'config';
import { useState, useEffect } from 'react';
import FastInputField from '../FastInputField';
import PricePlanForm from './PricePlan';
import DateTimeComponent from './DateTimeComponent';
import { styled } from '@mui/system';

const FastinputfieldStyle = {
  bgcolor: "#ECEFFF", borderRadius: "10px", padding: '8px 10px', width: "334px", "&:hover": {
    border: "1px solid #2D00D2"
  }
}
const LongdescriptionStyles = {
  height: "62px", background: "#ECEFFF", width: "334px",
  borderRadius: "10px"
}


const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    width: 280,
    borderRadius: 10,
    position: 'relative',
    backgroundColor: "#ECEFFF",
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    '&:focus': {
      borderRadius: 10,
      boxShadow: '0 0 0 0.2rem #ECEFFG',
    },
  },
  '& .MuiSelect-icon': {
    background: "white", borderRadius: 15, color: "#2D00D2"
  }
}));

const buttonBackgroud = "linear-gradient(103.4deg, #2D00D2 12.04%, #2C00D3 30.87%, #3700C8 46.11%, #3E00C0 63.54%, #4B00B4 80.82%, #5400AA 93.76%)"
const Inputfeild = { mt: 1, width: "150px", padding: '10px', fontSize: '15px', fontWeight: '700' }

// ==============================|| MAIN LOGO ||============================== //

interface Props {
  onSubmit: (data: any) => Promise<void>;
  defaultState?: any;
}

const WebinarForm = ({ defaultState, onSubmit }: Props) => {
  const [hostProfiles, setHostProfiles] = useState<any>([]);

  const dropdownIndex: any = {
    hostProfiles
  };

  const getHostProfiles = async () => {
    try {
      await axios.get(`${BASE_URL}/hostProfile/all`).then((response: any) => {
        const hosts = response.data || [];
        setHostProfiles(hosts);
      });
    } catch (error) {
      setHostProfiles([]);
    }
  };

  useEffect(() => {
    getHostProfiles();
  }, []);

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit
  });

  useEffect(() => {
    formik.setValues(defaultState || initialValues);
  }, [defaultState]);

  const values: any = formik.values;

  return (
    <Stack direction="column" gap={1} marginY={2}>
      <Stack direction="column">
        <Stack direction="row" flexWrap="wrap" gap={2}>
          {basicInfoSet.map((field) => (
            <Stack sx={{ display: 'flex', flexDirection: 'row', width: "45%" }} key={field.name} spacing={1} width={340}>
              <InputLabel sx={Inputfeild}>{field.label}</InputLabel>
              <FormControl>
                <FastInputField name={field.name} type={field.type} value={values[field.name]} onChange={formik.setFieldValue} style={FastinputfieldStyle} />
              </FormControl>
            </Stack>
          ))}
          <Stack sx={{ display: 'flex', flexDirection: 'row', width: "45%" }} spacing={1} mt={2} width={340}>
            <InputLabel sx={Inputfeild}>Long Description</InputLabel>
            <FormControl>
              <FastInputField multiline rows={3} name="longDescription" value={values.longDescription} onChange={formik.setFieldValue} style={LongdescriptionStyles} />
            </FormControl>
          </Stack>
        </Stack>
      </Stack>
      <Stack sx={{ display: 'flex', flexDirection: 'row' }}>
        <DateTimeComponent formik={formik} />
        <Stack direction="row" mt={2} flexWrap="wrap" gap={2} sx={{ width: '45%', ml: 2 }} width={340}>
          {dropdownSet.map((field) => {
            const options = (dropdownIndex[field.dataKey] || []).map((data: any) => ({ value: data._id, label: data[field.labelKey] }));
            const value = `${values[field.name]}`;

            return (
              <Stack key={field.name} spacing={1} direction="row">
                <InputLabel sx={Inputfeild}>{field.label}</InputLabel>
                <FormControl>
                  <Select input={<BootstrapInput />} id={field.name} value={value} onChange={formik.handleChange} name={field.name}>
                    {options.map((option: any) => (
                      <MenuItem value={option.value} key={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            );
          })}
        </Stack>
      </Stack>
      <PricePlanForm formik={formik} />
      <Stack display="flex" direction="row" justifyContent="center" flexWrap="wrap" gap={2}>
        <Button sx={{ color: '#000000', fontSize: '16px', fontWeight: '700', width: '90px', height: '40px' }} href="/webinar-list" variant="text" color="secondary">
          Cancel
        </Button>
        <Button sx={{ color: 'white', background: `${buttonBackgroud}`, width: '90px', height: '40px', fontSize: '16px', fontWeight: '700' }} variant="contained" onClick={() => formik.submitForm()}>
          {defaultState ? 'Update' : 'Save'}
        </Button>
      </Stack>
    </Stack>
  );
};

export default WebinarForm;
