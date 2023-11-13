import { Stack, InputLabel, InputBase, Select, MenuItem, FormControl, FormGroup, Box, Button } from '@mui/material';
import FastInputField from 'components/FastInputField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import useProducts from 'pages/advice-create/hooks/useProducts';
import React, { useEffect, useState } from 'react';
import { getAdvisory } from 'pages/advice-create/helper';
import Autocomplete from 'components/AutoComplete';
import axios from 'utils/axios';
import { BASE_URL } from 'config';
const Inputfeild = { width: '200px', padding: '15px', fontSize: '15px', fontWeight: '400' };
const fastinputfield = { backgroundColor: '#ECEFFF', borderRadius: '5px', height: '40px' };

const UsageRestrictionTab = ({ formik }: any) => {
  const values: any = formik.values;
  const [singleChecked, setSingleChecked] = useState(!values.singleUsedCoupon);
  const [SaleChecked, setSaleChecked] = useState(!values.notForSaleCoupon);
  const [listOfEmail, setListOfEmail] = useState([]);
  const [selectedUsers, setselectedUsers] = useState([]);
  const [selelctedProducts, setselelctedProducts] = useState([])
  const { products } = useProducts();
  let advisory: any;
  const init = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/usersemail/lists`);
      setListOfEmail(response.data || []);
    } catch (error) {
      console.log({ error: error });
    }
  };
  const listofuserSelected = () => {
    if (values?.allowedEmail?.length > 0 && listOfEmail?.length > 0) {
      const data = values.allowedEmail.map((id: any) => {
        const match: any = listOfEmail.find((val: any) => val.value === id);
        return match ? { value: id, label: match?.label } : { value: '', label: '' };
      });
      setselectedUsers(data);
    }
  };
  const listofproductSelected = () => {
    if (values?.listOfProduct?.length > 0 && advisory?.length > 0) {
      const data = values.listOfProduct.map((id: any) => {
        const match: any = advisory.find((val: any) => val.value === id);
        return match ? { value: id, label: match?.label } : { value: '', label: '' };
      });
      console.log(data);
      setselelctedProducts(data);
    }
  };
  useEffect(() => {
    listofuserSelected();
    listofproductSelected();
  }, [values.allowedEmails, listOfEmail,products,values.listOfProduct]);
  useEffect(() => {
    init();
  }, []);
  if (products?.relatedProductsIds) {
    advisory = getAdvisory(products).filter((x: any) => !x.relatedProductsIds?.length);
  } else {
    advisory = getAdvisory(products);
  }
  const handleChange = (e: any, data: any) => {
    const productvalues = data.map((id: any) => id.value);
    formik.setValues({
      ...values,
      listOfProduct: productvalues
    });
  };
  const handleChangeEmails = (e: any, data: any) => {
    const allowedemails = data.map((id: any) => id.value);
    formik.setValues({
      ...values,
      allowedEmail: allowedemails
    });
    setselectedUsers(data)
  };
  return (
    <>
      <Stack direction="row">
        <InputLabel sx={Inputfeild}>Minimum Speed :</InputLabel>
        <FormControl sx={{ flex: 1 }}>
          <FastInputField
            style={fastinputfield}
            placeholder="Minimum Spend"
            type="number"
            name="minSpend"
            value={values.minSpend}
            onChange={formik.setFieldValue}
          />
        </FormControl>
        <InputLabel sx={Inputfeild}>Maximum Spend :</InputLabel>
        <FormControl sx={{ flex: 1 }}>
          <FastInputField
            style={fastinputfield}
            placeholder="Maximum Spend"
            type="number"
            name="maxSpend"
            value={values.maxSpend}
            onChange={formik.setFieldValue}
          />
        </FormControl>
      </Stack>
      <Stack direction="row">
        <InputLabel sx={Inputfeild}>Individual use only :</InputLabel>
        <FormControl sx={{ flex: 1 }}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  name="singleUsedCoupon"
                  checked={!singleChecked}
                  onChange={(e) => {
                    setSingleChecked(!singleChecked);
                    values.singleUsedCoupon = singleChecked;
                  }}
                />
              }
              label="check this box if the coupon cannot be used in conjuction with other coupons."
            />
          </FormGroup>
        </FormControl>
        <InputLabel sx={Inputfeild}>Individual use only :</InputLabel>
        <FormControl sx={{ flex: 1 }}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  name="notForSaleCoupon"
                  checked={!SaleChecked}
                  onChange={(e) => {
                    setSaleChecked(!SaleChecked);
                    values.notForSaleCoupon = SaleChecked;
                  }}
                />
              }
              label="check this box if the coupon should not apply to items on sale. Per-item coupons will only work if the item is not on sale. Per-cart coupons will only work if there are items in the cart that are not on sale."
            />
          </FormGroup>
        </FormControl>
      </Stack>
      <Stack direction="row">
        <InputLabel sx={Inputfeild}>Products :</InputLabel>
        <FormControl sx={{ flex: 1 }}>
          <Autocomplete multiple valueKey="label" name="products" value={selelctedProducts} onChange={handleChange} options={advisory} />
        </FormControl>
        {/* <InputLabel sx={Inputfeild}>Exculde products :</InputLabel>
        <FormControl sx={{ flex: 1 }}>
          <FastInputField
            style={{ backgroundColor: '#ECEFFF', borderRadius: '5px', height: '40px' }}
            placeholder="search for product......"
            name="excludeProdList"
            value={values.excludeProdList}
            onChange={formik.setFieldValue}
          />
        </FormControl> */}
      </Stack>
      {/* <Stack direction="row">
        <InputLabel sx={Inputfeild}>Products categories :</InputLabel>
        <FormControl sx={{ flex: 1 }}>
          <FastInputField
            style={{ backgroundColor: '#ECEFFF', borderRadius: '5px', height: '40px' }}
            placeholder="search for product......."
            name="listOfCategory"
            value={values.listOfCategory}
            onChange={formik.setFieldValue}
          />
        </FormControl>
        <InputLabel sx={Inputfeild}>Exclude categories :</InputLabel>
        <FormControl sx={{ flex: 1 }}>
          <FastInputField
            style={{ backgroundColor: '#ECEFFF', borderRadius: '5px', height: '40px' }}
            placeholder="search for product........"
            name="excludeCatList"
            value={values.excludeCatList}
            onChange={formik.setFieldValue}
          />
        </FormControl>
      </Stack> */}
      <Stack direction="row">
        <InputLabel sx={Inputfeild}>USER GROUP:</InputLabel>{' '}
        <FormControl sx={{ flex: 1 }}>
          <Autocomplete multiple valueKey="label" name="Emails" value={selectedUsers} onChange={handleChangeEmails} options={listOfEmail} />
        </FormControl>
      </Stack>
    </>
  );
};

export default UsageRestrictionTab;
