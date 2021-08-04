import { Container } from "react-bootstrap";
import AvailableList from "../components/AvailableList";
import ProductsList from "../components/ProductsList";

function HomeView() {
  return (
    <Container fluid>
      <section>
        <h3>Prodotti</h3>
        <ProductsList />
      </section>
      <section>
        <h3>Disponibilità</h3>
        <AvailableList />
      </section>
    </Container>
  );
}

export default HomeView;
