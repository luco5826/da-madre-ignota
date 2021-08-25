import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
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

  const updateElement = (availability: MenuAvailability) => {
    setAvailability((old) =>
      old.map((a) => (a.id === availability.id ? availability : { ...a }))
    );
  };

  return (
    <section>
      <Calendar
        onChange={setSelectedDate}
        className="w-100 p-0"
        tileClassName={({ activeStartDate, date, view }) =>
          availability.filter((a) => a.day.isSame(date)).length > 0
            ? "bg-warning"
            : null
        }
      />
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
            .filter((a) => a.day.isSame(selectedDate))
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
              {/* TODO: Add button onClick */}
              <Button className="d-flex align-items-center">
                <BsPlusSquare className="me-2" color="white" size={24} />
                Aggiungi
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
    </section>
  );
}

export default AvailableList;
