import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { BsEye, BsPlusSquare, BsTrash } from "react-icons/bs";
import API from "../API";
import { StoredProduct } from "../commonTypes";
import AddProductModal from "./AddProductModal";

function ProductsList() {
  const [products, setProducts] = useState<StoredProduct[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    API.getProducts().then((products) => setProducts(products));
  }, []);

  return (
    <Table striped bordered>
      <thead>
        <tr>
          {/* <th>ID</th> */}
          <th>Nome</th>
          <th>Descrizione</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => {
          return (
            <tr
              key={p.id}
              onClick={() => {
                setShowAddModal(true);
              }}
            >
              {/* <td>{p.id}</td> */}
              <td className="text-break">{p.name}</td>
              <td className="text-break">{p.description}</td>
              <td>
                <BsEye />
              </td>
            </tr>
          );
        })}
        <tr>
          <td colSpan={3} align="center">
            <Button
              className="d-flex align-items-center"
              onClick={() => setShowAddModal(true)}
            >
              <BsPlusSquare className="me-2" color="white" size={24} />
              Aggiungi
            </Button>
          </td>
        </tr>
      </tbody>
      <AddProductModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onProductSaved={(newProduct) => {
          setProducts((old) => [...old, newProduct]);
          setShowAddModal(false);
        }}
      />
    </Table>
  );
}

export default ProductsList;
