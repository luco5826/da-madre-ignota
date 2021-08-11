import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import API from "../API";
import { Product, StoredProduct } from "../commonTypes";

type Props = {
  show: boolean;
  product: StoredProduct;
  onHide: () => void;
  onProductSaved: (p: StoredProduct) => void;
};

const EditProductModal: React.FC<Props> = ({
  show,
  product,
  onHide,
  onProductSaved,
}) => {
  const [newProduct, setNewProduct] = useState<StoredProduct>({ ...product });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProduct((oldProduct) => {
      oldProduct[e.target.id as keyof Product] = e.target.value;
      return { ...oldProduct };
    });
  };
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    API.updateProduct(newProduct).then(onProductSaved);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header>
        <Modal.Title>Modifica prodotto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Nome</Form.Label>
            <Form.Control
              id="name"
              value={newProduct.name}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Descrizione</Form.Label>
            <Form.Control
              id="description"
              value={newProduct.description}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Annulla
        </Button>
        <Button variant="primary" onClick={handleAddProduct}>
          Salva
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProductModal;
