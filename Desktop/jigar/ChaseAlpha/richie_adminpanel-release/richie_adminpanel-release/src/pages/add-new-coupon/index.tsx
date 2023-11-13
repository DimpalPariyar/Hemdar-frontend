import AddNewcouponsFrom from 'components/coupon-form/add-coupons';
import { BASE_URL } from 'config';
import axios from 'utils/axios';
import { useNavigate } from 'react-router-dom';
import React from 'react';

const AddNewCoupon = () => {
  const history = useNavigate();
  const createCoupon = async (data: any) => {
    try {
      await axios.post(`${BASE_URL}/coupon`, data);
      history('/coupons-list');
    } catch (error) {}
  };
  return (
    <div>
      <AddNewcouponsFrom onSubmit={createCoupon} />
    </div>
  );
};

export default AddNewCoupon;
