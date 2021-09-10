import { Container } from "react-bootstrap";
import OrdersList from "../components/OrdersList";

function OrdersView() {
  return (
    <Container fluid>
      <h3>Ordini</h3>
      <OrdersList />
    </Container>
  );
}

export default OrdersView;
