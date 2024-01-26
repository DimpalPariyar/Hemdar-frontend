const _ = require('lodash');
const SubscriptionOrderModel = require('../model/subscriptionOrder.model');
const RazorPayPaymentModel = require('../model/razorPayPayment.model');
const {
  fetchOrder,
  fetchOrderPayments,
  getAllSubscriptionInvoices,
} = require('../service/razorpay_service');
const OrderModel = require('../model/order.model');
require('dotenv').config();

const updateSubscriptionOrderOnDb = async (
  subOrderId,
  subId,
  advisoryId,
  userId,
  gstNumber,
  overrideStatus
) => {
  const invoices = await getAllSubscriptionInvoices(subId);
  return await Promise.all(
    _.map(invoices.items, async (item) => {
      return await updateOrderOnDb(
        subOrderId,
        item.order_id,
        userId,
        advisoryId,
        gstNumber,
        overrideStatus
      );
    })
  );
};

async function updateOrderAndPayment(
  paymentResponse,
  orderResponse,
  gstNumber,
  orderId,
  subOrderId,
  userId,
  advisoryId,
  overrideStatus
) {
  // payments,
  //   orderPayload,
  //   order.gst,
  //   orderPayload.id,
  //   undefined,
  //   userId,
  //   undefined,
  //   undefined;
  const payments = await Promise.all(
    _.map(paymentResponse.items, async (responseItem) => {
      const result = calculateListAmountAndGST(responseItem.amount);
      const payment = await RazorPayPaymentModel.findOneAndUpdate(
        { razorPayPaymentId: responseItem.id },
        {
          $set: {
            entity: responseItem.entity,
            listAmount: result.listAmount,
            listGst: result.GST,
            amount: responseItem.amount,
            currency: responseItem.currency,
            status: responseItem.status,
            order_id: responseItem.order_id,
            invoice_id: responseItem.invoice_id,
            international: responseItem.international,
            method: responseItem.method,
            amount_refunded: responseItem.amount_refunded,
            refund_status: responseItem.refund_status,
            captured: responseItem.captured,
            description: responseItem.description,
            card_id: responseItem.card_id,
            bank: responseItem.bank,
            wallet: responseItem.wallet,
            vpa: responseItem.vpa,
            email: responseItem.email,
            contact: responseItem.contact,
            fee: responseItem.fee,
            tax: responseItem.tax,
            error_code: responseItem.error_code,
            error_description: responseItem.error_description,
            error_source: responseItem.error_source,
            error_step: responseItem.error_step,
            error_reason: responseItem.error_reason,
            acquirer_data: JSON.stringify(responseItem.acquirer_data),
            gst: gstNumber,
            created_at: responseItem.created_at
              ? new Date(responseItem.created_at * 1000)
              : null,
          },
        },
        { upsert: true, new: true }
      );
      return payment._id;
    })
  );
  const result = calculateListAmountAndGST(orderResponse.amount);
  return OrderModel.findOneAndUpdate(
    { razorPayOrderId: orderId },
    {
      $set: {
        userId: userId,
        listAmount: result.listAmount,
        listGst: result.GST,
        razorPayOrderId: orderResponse.id,
        amount: orderResponse.amount,
        amount_paid: orderResponse.amount_paid,
        totalAmount: orderResponse.amount_paid,
        amount_due: orderResponse.amount_due,
        currency: orderResponse.currency,
        notes: orderResponse.notes,
        receipt: orderResponse.receipt,
        status: orderResponse.status,
        attempts: orderResponse.attempts,
        created_at: orderResponse.created_at
          ? new Date(orderResponse.created_at * 1000)
          : null,
      },
      $addToSet: { payments: { $each: payments } },
    },
    { upsert: true, new: true }
  );
}

async function updateFailedOrderAndPayment(
  paymentResponse,
  orderResponse,
  gstNumber,
  orderId,
  subOrderId,
  userId,
  advisoryId,
  overrideStatus
) {
  const payments = await Promise.all(
    _.map(paymentResponse.items, async (responseItem) => {
      const result = calculateListAmountAndGST(responseItem.amount);
      const payment = await RazorPayPaymentModel.findOneAndUpdate(
        { razorPayPaymentId: responseItem.id },
        {
          $set: {
            entity: responseItem.entity,
            listAmount: result.listAmount,
            listGst: result.GST,
            amount: responseItem.amount,
            currency: responseItem.currency,
            status: responseItem.status,
            order_id: responseItem.order_id,
            invoice_id: responseItem.invoice_id,
            international: responseItem.international,
            method: responseItem.method,
            amount_refunded: responseItem.amount_refunded,
            refund_status: responseItem.refund_status,
            captured: responseItem.captured,
            description: responseItem.description,
            card_id: responseItem.card_id,
            bank: responseItem.bank,
            wallet: responseItem.wallet,
            vpa: responseItem.vpa,
            email: responseItem.email,
            contact: responseItem.contact,
            fee: responseItem.fee,
            tax: responseItem.tax,
            error_code: responseItem.error_code,
            error_description: responseItem.error_description,
            error_source: responseItem.error_source,
            error_step: responseItem.error_step,
            error_reason: responseItem.error_reason,
            acquirer_data: JSON.stringify(responseItem.acquirer_data),
            gst: gstNumber,
            created_at: responseItem.created_at
              ? new Date(responseItem.created_at * 1000)
              : null,
          },
        },
        { upsert: true, new: true }
      );
      return payment._id;
    })
  );

  return OrderModel.findOneAndUpdate(
    { razorPayOrderId: orderId },
    {
      $addToSet: { payments: { $each: payments } },
    },
    { upsert: true, new: true }
  );
}

const updateOrderOnDb = async (
  subOrderId,
  orderId,
  userId,
  advisoryId,
  gstNumber,
  overrideStatus
) => {
  const orderResponse = await fetchOrder(orderId);
  const paymentResponse = await fetchOrderPayments(orderId);

  return await updateOrderAndPayment(
    paymentResponse,
    orderResponse,
    gstNumber,
    orderId,
    subOrderId,
    userId,
    advisoryId,
    overrideStatus
  );
};
const updateFailedOrderOnDb = async (
  subOrderId,
  orderId,
  userId,
  advisoryId,
  gstNumber,
  overrideStatus
) => {
  const paymentResponse = await fetchOrderPayments(orderId);

  return await updateFailedOrderAndPayment(
    paymentResponse,
    undefined,
    gstNumber,
    orderId,
    subOrderId,
    userId,
    advisoryId,
    overrideStatus
  );
};

function calculateListAmountAndGST(amount) {
  const GST_RATE = 0.18;
  const listAmount = (amount / (1 + GST_RATE)).toFixed(2);
  const GST = (amount - listAmount).toFixed(2);
  return { listAmount, GST };
}

const updateSubsOnDb = async (subId, razorPaySubId, razorPayResponse) => {
  let query;
  if (subId) {
    query = { _id: subId };
  } else if (razorPaySubId) {
    query = { razorPaySubscriptionId: razorPaySubId };
  }
  return SubscriptionOrderModel.findOneAndUpdate(
    query,
    {
      $set: {
        razorPaySubscriptionId: razorPayResponse.id,
        planId: razorPayResponse.plan_id,
        customerId: razorPayResponse.customer_id,
        status: razorPayResponse.status,
        currentStart: razorPayResponse.current_start
          ? new Date(razorPayResponse.current_start * 1000)
          : null,
        currentEnd: razorPayResponse.current_end
          ? new Date(razorPayResponse.current_end * 1000)
          : null,
        endedAt: razorPayResponse.ended_at
          ? new Date(razorPayResponse.ended_at * 1000)
          : null,
        quantity: razorPayResponse.quantity,
        notes: razorPayResponse.notes,
        chargeAt: razorPayResponse.charge_at
          ? new Date(razorPayResponse.charge_at * 1000)
          : null,
        offerId: razorPayResponse.offer_id,
        startAt: razorPayResponse.start_at
          ? new Date(razorPayResponse.start_at * 1000)
          : null,
        endAt: razorPayResponse.end_at
          ? new Date(razorPayResponse.end_at * 1000)
          : null,
        authAttempts: razorPayResponse.auth_attempts,
        totalCount: razorPayResponse.total_count,
        paidCount: razorPayResponse.paid_count,
        customerNotify: razorPayResponse.customer_notify,
        createdAt: razorPayResponse.created_at
          ? new Date(razorPayResponse.created_at * 1000)
          : null,
        expireBy: razorPayResponse.expire_by,
        shortUrl: razorPayResponse.short_url,
        hasScheduledChanges: razorPayResponse.has_scheduled_changes,
        changeScheduledAt: razorPayResponse.change_scheduled_at
          ? new Date(razorPayResponse.change_scheduled_at * 1000)
          : null,
        remainingCount: razorPayResponse.remaining_count,
      },
    },
    { new: true, upsert: true }
  );
};

module.exports = {
  updateSubsOnDb,
  updateOrderOnDb,
  updateSubscriptionOrderOnDb,
  updateOrderAndPayment,
  updateFailedOrderAndPayment,
  updateFailedOrderOnDb,
};
