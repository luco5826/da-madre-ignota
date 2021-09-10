import { useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import Calendar from "react-calendar";
import API from "../API";
import { Order, OrderedProduct } from "../commonTypes";
import { groupOrdersByProduct } from "../Utils";
import OrdersByProduct from "./OrdersByProduct";

function OrdersList() {
  const [groupedProducts, setGroupedProducts] = useState<OrderedProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedProduct, setSelectedProduct] = useState<
    OrderedProduct | undefined
  >(undefined);

  useEffect(() => {
    API.getOrders().then(setOrders);
  }, []);

  /**
   * Reset the customers list when changing date
   */
  useEffect(() => {
    setSelectedProduct(undefined);
  }, [selectedDate]);

  useEffect(() => {
    if (orders.length > 0) {
      setGroupedProducts(groupOrdersByProduct(orders));
    }
  }, [orders.length, orders]);

  return (
    <Container fluid>
      <Row>
        <Col md={6}>
          {/* Change the background of calendar days that contains at least an order */}
          <Calendar
            onChange={setSelectedDate}
            className="w-100 p-0"
            tileClassName={({ activeStartDate, date, view }) =>
              orders.filter(
                (o) =>
                  o.availabilities.filter((a) => a.day.isSame(date)).length > 0
              ).length > 0
                ? "bg-warning"
                : null
            }
          />
        </Col>
        <Col md={6}>
          <Table striped bordered>
            <thead>
              <tr>
                <th colSpan={2} className="text-center">
                  Prodotti
                </th>
              </tr>
              <tr>
                <th>Prodotto</th>
                <th>Qtà</th>
              </tr>
            </thead>
            <tbody>
              {groupedProducts
                .filter((product) => product.day.isSame(selectedDate, "day"))
                .map((product) => (
                  <tr
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    style={{
                      backgroundColor:
                        selectedProduct?.id === product.id ? "lightblue" : "",
                    }}
                  >
                    <td>{product.name}</td>
                    <td>{product.quantity}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Col>
        <Col>
          {selectedProduct && (
            <OrdersByProduct orders={orders} product={selectedProduct} />
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default OrdersList;
