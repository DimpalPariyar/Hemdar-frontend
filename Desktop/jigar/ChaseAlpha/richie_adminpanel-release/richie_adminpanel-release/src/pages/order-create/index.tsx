import OrderForm from 'components/Order-form';
import React, { useState } from 'react';
import { BASE_URL } from 'config';
import axios from 'utils/axios';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/reducers/snackbar';
import { useNavigate } from 'react-router-dom';

const CreateOrder = () => {
  const [finaldata, setFinaldata] = useState({});
  const history = useNavigate();
  const dispatch = useDispatch();

  const createOrder: any = async (data: any) => {
    setFinaldata(() => {
      return {
        ...data,
        listAmount: data.listAmount * 100,
        totalAmount: data.totalAmount * 100,
        listGst: data.listGst * 100,
        amount_paid: data.amount_paid * 100
      };
    });

    try {
      await axios.post(`${BASE_URL}/admin/createorder`, finaldata);
      history('/orders');
    } catch (error) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Unable to create the product',
          variant: 'alert',
          alert: {
            color: 'error'
          }
        })
      );
    }
  };
  return (
    <div>
      <OrderForm onSubmit={createOrder} />
    </div>
  );
};

export default CreateOrder;
