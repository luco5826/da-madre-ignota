import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import API from "../API";
import { Product, StoredProduct } from "../commonTypes";

type Props = {
  show: boolean;
  onHide: () => void;
  onProductSaved: (p: StoredProduct) => void;
};

const AddProductModal: React.FC<Props> = ({ show, onHide, onProductSaved }) => {
  const [newProduct, setNewProduct] = useState<Product>({
    name: "",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProduct((oldProduct) => {
      oldProduct[e.target.id as keyof Product] = e.target.value;
      return { ...oldProduct };
    });
  };
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    API.saveProduct(newProduct).then(onProductSaved);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header>
        <Modal.Title>Aggiungi prodotto</Modal.Title>
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

export default AddProductModal;
