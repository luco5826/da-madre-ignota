import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import Calendar from "react-calendar";
import { BsPlusSquare } from "react-icons/bs";
import API from "../API";
import { MenuAvailability, StoredProduct } from "../commonTypes";
import AvailableListEntry from "./AvailableListEntry";

function AvailableList() {
  const [availability, setAvailability] = useState<MenuAvailability[]>([]);
  const [products, setProducts] = useState<StoredProduct[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    API.getAvailability().then(setAvailability);
  }, []);
  useEffect(() => {
    API.getProducts().then(setProducts);
  }, []);

  const updateElement = (newAvailability: MenuAvailability) => {
    setAvailability((old) =>
      old.map((a) =>
        a.id === newAvailability.id || a.id === -1 ? newAvailability : { ...a }
      )
    );
  };
  const onAddNewAvailability = () => {
    // Do not add a new availability if there's still one to be added left
    if (availability.filter((a) => a.id === -1).length !== 0) {
      return;
    }
    setAvailability((old) => {
      return [
        ...old,
        {
          id: -1,
          day: dayjs(selectedDate),
          hidden: false,
          quantity: 0,
          menu_id: -1,
        },
      ];
    });
  };

  return (
    <Container fluid>
      <Row>
        <Col md={6}>
          <Calendar
            onChange={setSelectedDate}
            className="w-100 p-0"
            tileClassName={({ activeStartDate, date, view }) =>
              availability.filter((a) => a.day.isSame(date)).length > 0
                ? "bg-warning"
                : null
            }
          />
        </Col>
        <Col md={6}>
          <Table striped bordered>
            <thead>
              <tr>
                <th>Prodotto</th>
                <th>Qtà</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {availability
                .filter((a) => a.day.isSame(selectedDate, "day"))
                .map((a) => (
                  <AvailableListEntry
                    key={a.id}
                    availability={a}
                    products={products}
                    onUpdateComplete={updateElement}
                  />
                ))}
              <tr>
                <td colSpan={3} align="center">
                  <Button
                    className="d-flex align-items-center"
                    onClick={onAddNewAvailability}
                  >
                    <BsPlusSquare className="me-2" color="white" size={24} />
                    Aggiungi
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

export default AvailableList;
