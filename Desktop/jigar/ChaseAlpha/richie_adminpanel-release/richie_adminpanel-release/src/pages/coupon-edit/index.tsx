import axios from '../../utils/axios';
import { useNavigate, useParams } from 'react-router';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from 'config';
import CouponFrom from 'components/coupon-form/add-coupons';

const EditCoupon = () => {
  const { id = '' } = useParams<{ id: string }>();
  const [coupon, setCoupon] = useState<any>(null);
  const history = useNavigate();
  const getCoupon = async () => {
    try {
      await axios.get(`${BASE_URL}/coupon/${id}`).then((response: any) => {
        const data = response.data;
        setCoupon(data);
      });
    } catch (e) {
      console.log(e);
      setCoupon(null);
    }
  };
  useEffect(() => {
    getCoupon();
    return () => {
      setCoupon({});
    };
  }, []);
  const updateCoupon = async (data: any) => {
    await axios.patch(`${BASE_URL}/coupon/${id}`,data).then((response: any) => {
      history('/coupons-list');
    });
    try {
    } catch (error) {
      console.log(error);
    }
  };
  return <div>{coupon && <CouponFrom defaultState={coupon} onSubmit={updateCoupon}/>}</div>;
};

export default EditCoupon;
