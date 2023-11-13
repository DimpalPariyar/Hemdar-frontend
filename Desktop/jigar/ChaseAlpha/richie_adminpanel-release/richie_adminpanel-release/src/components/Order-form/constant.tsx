export const initialValues = {
    status: '',
    // dateandtime: undefined,
    address: '',
    name: '',
    mobile: '',
    gstNumber: '',
    email: "",
    amount: "",
    duration: NaN,
    UserId: ''
};
// export const pdfdocumentdata = {
//     invoiceNumber: '',
//     invoiceDate: '',
//     invoiceLink: ''
// };

// export const invoiceDetails = {
//     productSubtotal: '',
//     gst: '',
//     orderTotal: '',
//     paid: ''
// };

export const orderDetails = [
    { name: 'status', label: 'Status', type: 'string' },
    { name: 'email', label: 'Email Id', type: 'email' },
    { name: 'gstNumber', label: 'Gst Number', type: 'string' },
];
export const paymentDetails = [
    { name: 'razorPayOrderId', label: 'Razorpay OrderId', type: 'string' },
    // { name: 'startdate', label: 'Start Date', type: 'date' },
    // { name: 'enddate', label: 'End Date', type: 'date' },
    // { name: 'duration', label: 'Duration', type: 'number' },
]


export const invoicepdf = [
    { name: 'invoiceNumber', label: 'Invoice Number', type: 'number' },
    { name: 'invoiceDate', label: 'Invoice Date', type: 'string' },
    { name: 'invoiceLink', label: 'Invoice Link' },
]

export const invoiceOrder = [
    { name: 'productSubtotal', label: 'Product Subtotal', type: 'number' },
    { name: 'gst', label: 'GST', type: 'string' },
    { name: 'orderTotal', label: 'Order Total' },
    { name: 'paid', label: 'paid' },

]