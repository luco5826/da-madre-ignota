import React from "react";
import { Table } from "react-bootstrap";
import { Order, OrderedProduct } from "../commonTypes";

interface EntryProps {
  order: Order;
  product: OrderedProduct;
}

const OrdersByProductEntry: React.FC<EntryProps> = ({ order, product }) => {
  return (
    <tr key={order.user.id}>
      <td>{order.user.id}</td>
      <td>{order.user.email}</td>
      <td>
        {
          order.availabilities.find(
            (a) => a.menu_id === product.id && a.day.isSame(product.day, "day")
          )!.quantity
        }
      </td>
    </tr>
  );
};

interface Props {
  orders: Order[];
  product: OrderedProduct;
}

const OrdersByProduct: React.FC<Props> = ({ orders, product }) => {
  return (
    <Table striped bordered>
      <thead>
        <tr>
          <th colSpan={3} className="text-center">
            Clienti
          </th>
        </tr>
        <tr>
          <th>UserID</th>
          <th>Email</th>
          <th>Qtà</th>
        </tr>
      </thead>
      <tbody>
        {orders
          .filter(
            (o) =>
              o.availabilities.filter(
                (a) =>
                  a.menu_id === product.id && a.day.isSame(product.day, "day")
              ).length > 0
          )
          .map((o) => (
            <OrdersByProductEntry key={o.user.id} order={o} product={product} />
          ))}
      </tbody>
    </Table>
  );
};

export default OrdersByProduct;
