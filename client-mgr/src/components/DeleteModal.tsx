import React from "react";
import { Button, Modal } from "react-bootstrap";

type Props = {
  show: boolean;
  title: string;
  subtitle: string;
  onHide: () => void;
  onDelete: () => void;
};

const DeleteModal: React.FC<Props> = ({
  show,
  title,
  subtitle,
  onHide,
  onDelete,
}) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{subtitle}</Modal.Body>
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

export default DeleteModal;
