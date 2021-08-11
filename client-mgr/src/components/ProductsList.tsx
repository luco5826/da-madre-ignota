import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { BsPencil, BsPlusSquare, BsTrash } from "react-icons/bs";
import API from "../API";
import { StoredProduct } from "../commonTypes";
import AddProductModal from "./AddProductModal";
import DeleteProductModal from "./DeleteProductModal";
import EditProductModal from "./EditProductModal";

function ProductsList() {
  const [products, setProducts] = useState<StoredProduct[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<boolean | number>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean | number>(
    false
  );

  useEffect(() => {
    API.getProducts().then(setProducts);
  }, []);

  return (
    <Table striped bordered>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Descrizione</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => {
          return (
            <tr key={p.id}>
              <td className="text-break" style={{ minWidth: "100px" }}>
                {p.name}
              </td>
              <td className="text-break">{p.description}</td>
              <td>
                <div
                  className="d-flex justify-content-around"
                  style={{ minWidth: "40px" }}
                >
                  <BsPencil onClick={() => setShowEditModal(p.id)} />
                  <BsTrash
                    onClick={() => setShowDeleteModal(p.id)}
                    color="red"
                  />
                </div>
              </td>
              <EditProductModal
                show={showEditModal === p.id}
                product={p}
                onHide={() => setShowEditModal(false)}
                onProductSaved={(prod) => {
                  setShowEditModal(false);
                  setProducts((old) => [
                    ...old.filter((product) => product.id !== prod.id),
                    prod,
                  ]);
                }}
              />
              <DeleteProductModal
                show={showDeleteModal === p.id}
                onHide={() => setShowDeleteModal(false)}
                onDelete={() =>
                  API.deleteProduct(p).then(() => {
                    setProducts((old) => [
                      ...old.filter((prod) => prod.id !== p.id),
                    ]);
                    setShowDeleteModal(false);
                  })
                }
              />
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
