import { Container } from "react-bootstrap";
import ProductsList from "../components/ProductsList";

function HomeView() {
  return (
    <Container fluid>
      <section>
        <h3>Prodotti</h3>
        <ProductsList />
      </section>
    </Container>
  );
}

export default HomeView;
