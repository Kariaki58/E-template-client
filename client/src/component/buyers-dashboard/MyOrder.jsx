import React, { useContext, useState } from 'react';
import { OrderContext } from '../../contextApi/Orders';
import ReactPaginate from 'react-paginate';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../../App.css';

const MyOrder = () => {
  const { orders, loading, error } = useContext(OrderContext);
  const [currentPage, setCurrentPage] = useState(0);
  const ordersPerPage = 5;

  if (loading) return <p className="text-center text-blue-600">Loading...</p>;
  if (error) return <p className="text-center text-red-600">Error: {error}</p>;

  const offset = currentPage * ordersPerPage;
  const currentOrders = orders.slice(offset, offset + ordersPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(price);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('My Orders', 20, 10);

    const tableColumn = ['Product ID', 'Size', 'Color', 'Quantity', 'Price'];
    const tableRows = [];

    orders.forEach(order => {
      const orderData = [
        order._id,
        order.size,
        order.color,
        order.quantity,
        formatPrice(order.quantity * order.price),
      ];
      tableRows.push(orderData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.save('my-orders.pdf');
  };

  return (
    <div className="container mx-auto p-4 h-screen overflow-y-auto mb-10 custom-scrollbar">
      <h1 className="text-2xl font-bold mb-4 text-center">My Orders</h1>
      <button
        onClick={downloadPDF}
        className="bg-green-600 text-white py-2 px-4 rounded mb-4"
      >
        Download Orders
      </button>
      {currentOrders.map((order) => (
        <div key={order._id} className="shadow-md rounded-lg mb-6 p-4">
          <div className="mb-4">
            <h3 className="text-gray-700">
              Total Amount: {formatPrice(order.price * order.quantity)}
            </h3>
            <p className="text-gray-700">
              Shipping Address: {order.shippingAddress.address},{' '}
              {order.shippingAddress.city}
            </p>
            <p
              className={`text-sm ${
                order.status === 'Pending'
                  ? 'text-yellow-500'
                  : order.status === 'Cancelled'
                  ? 'text-red-700'
                  : 'text-green-500'
              } font-semibold`}
            >
              Status: {order.status}
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border-collapse">
              <thead className="bg-gray-100">
                <tr className="text-gray-800">
                  <th className="py-2 px-2 sm:px-4 text-left">Product ID</th>
                  <th className="py-2 px-2 sm:px-4 text-left">Size</th>
                  <th className="py-2 px-2 sm:px-4 text-left">Color</th>
                  <th className="py-2 px-2 sm:px-4 text-left">Quantity</th>
                  <th className="py-2 px-2 sm:px-4 text-left">Price</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t text-gray-800">
                  <td className="py-2 px-2 sm:px-4">{order._id}</td>
                  <td className="py-2 px-2 sm:px-4">{order.size}</td>
                  <td className="py-2 px-2 sm:px-4">{order.color}</td>
                  <td className="py-2 px-2 sm:px-4">{order.quantity}</td>
                  <td className="py-2 px-2 sm:px-4">{formatPrice(order.quantity * order.price)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <div className="flex justify-center mt-8">
        <ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={Math.ceil(orders.length / ordersPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={'flex items-center space-x-2'}
          activeClassName={'bg-green-600 text-white'}
          previousClassName={
            'bg-gray-950 text-white py-2 px-4 rounded-l-lg hover:bg-gray-700'
          }
          nextClassName={
            'bg-gray-950 text-white py-2 px-4 rounded-r-lg hover:bg-gray-700'
          }
          pageClassName={
            'bg-gray-100 py-2 px-4 border border-gray-300 hover:bg-gray-200'
          }
          disabledClassName={'text-gray-400 cursor-not-allowed'}
        />
      </div>
    </div>
  );
};

export default MyOrder;
