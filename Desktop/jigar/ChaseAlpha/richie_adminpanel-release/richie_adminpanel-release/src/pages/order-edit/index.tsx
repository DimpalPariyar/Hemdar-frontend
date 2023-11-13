import axios from '../../utils/axios';
import OrderForm from 'components/Order-form';
import { BASE_URL } from 'config';
import { useNavigate, useParams } from 'react-router';
import React, { useEffect, useState } from 'react';

const OrderEdit = () => {
  const { id = '' } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const history = useNavigate();
  const getOrder = async () => {
    try {
      await axios.get(`${BASE_URL}/admin/orders/${id}`).then((response: any) => {
        const data = response.data;
        setOrder(() => {
          return {
            ...data,
            listAmount: data.listAmount / 100,
            totalAmount: data.totalAmount / 100,
            listGst: data.listGst / 100,
            amount_paid: data.amount_paid / 100
          };
        });
      });
    } catch (e) {
      console.log(e);
      setOrder(null);
    }
  };
  const UpdateOrder = async (data: any) => {
    let updatedata = {
      ...data,
      listAmount: data.listAmount * 100,
      totalAmount: data.totalAmount * 100,
      listGst: data.listGst * 100,
      amount_paid: data.amount_paid * 100
    };
    try {
      await axios.put(`${BASE_URL}/admin/orders/${id}`, updatedata).then((response: any) => {
        const data = response.data;
        console.log(data);
      });
    } catch (e) {
      console.log(e);
    }
    history('/orders');
  };

  useEffect(() => {
    getOrder();
    return () => {
      setOrder({});
    };
  }, []);

  return <div>{order && <OrderForm defaultState={order} onSubmit={UpdateOrder} />}</div>;
};

export default OrderEdit;
