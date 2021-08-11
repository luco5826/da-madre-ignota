import React from "react";
import { Button, Modal } from "react-bootstrap";

type Props = {
  show: boolean;
  onHide: () => void;
  onDelete: () => void;
};

const DeleteProductModal: React.FC<Props> = ({ show, onHide, onDelete }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header>
        <Modal.Title>Elimina prodotto</Modal.Title>
      </Modal.Header>
      <Modal.Body>Vuoi davvero eliminare questo prodotto?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Annulla
        </Button>
        <Button variant="primary" onClick={onDelete}>
          Elimina
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteProductModal;
