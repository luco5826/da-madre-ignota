import { Container } from "react-bootstrap";
import AvailableList from "../components/AvailableList";

function AvailabilityView() {
  return (
    <Container fluid>
      <h3>Disponibilit√†</h3>
      <AvailableList />
    </Container>
  );
}

export default AvailabilityView;
