import React, { useState } from "react";
import { BsCheck, BsEye, BsEyeSlash, BsPencil } from "react-icons/bs";
import API from "../API";
import { MenuAvailability, StoredProduct } from "../commonTypes";

interface Props {
  availability: MenuAvailability;
  products: StoredProduct[];
  onUpdateComplete: (a: MenuAvailability) => void;
}

const AvailableListEntry: React.FC<Props> = ({
  availability,
  products,
  onUpdateComplete,
}) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const [newProduct, setNewProduct] = useState<StoredProduct | undefined>(
    undefined
  );
  const [hasChanged, setHasChanged] = useState({
    quantity: false,
    product: false,
  });

  const toggleVisibility = (value: boolean): void => {
    API.toggleHideAvailiability(availability).then(() => {
      availability.hidden = value;
      onUpdateComplete(availability);
    });
  };

  const saveAvailability = async () => {
    if (newQuantity === availability.quantity || newQuantity < 0) {
      setNewQuantity(0);
      setEditMode(false);
      return;
    }

    if (hasChanged.quantity) {
      await API.updateQuantity(availability, newQuantity);
      availability.quantity = newQuantity;
      setNewQuantity(0);
    }
    if (hasChanged.product) {
      // TODO: Check that the new availability is not a duplicate of an existing one
      await API.updateAvailabilityProduct(availability, newProduct!);
      availability.product = newProduct;
      setNewProduct(undefined);
    }

    onUpdateComplete(availability);
    setEditMode(false);
    setHasChanged({ quantity: false, product: false });
  };

  const changeProduct = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const targetProduct = products.find(
      (p) => p.id === Number.parseInt(event.target.value)
    );
    setNewProduct(targetProduct);
    setHasChanged((old) => {
      return { ...old, product: true };
    });
  };
  const changeQuantity = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (!value) return;
    setNewQuantity(event.target.value ? value : 0);
    setHasChanged((old) => {
      return { ...old, quantity: true };
    });
  };

  return (
    <tr
      className={`${
        availability.hidden && "text-muted text-decoration-line-through"
      }`}
      style={{ minHeight: "100px" }}
    >
      <td className="text-break" style={{ minWidth: "100px" }}>
        {editMode ? (
          <select onChange={changeProduct}>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        ) : (
          availability.product?.name
        )}
      </td>
      <td className="text-break">
        {editMode ? (
          <input
            type="number"
            style={{ maxWidth: "50px" }}
            value={newQuantity}
            onChange={changeQuantity}
          />
        ) : (
          availability.quantity
        )}
      </td>
      <td>
        <div
          className="d-flex justify-content-around"
          style={{ minWidth: "10px" }}
        >
          {editMode ? (
            <BsCheck size="18" color="green" onClick={saveAvailability} />
          ) : (
            <BsPencil
              onClick={() => {
                setEditMode(true);
                setNewQuantity(availability.quantity!);
              }}
            />
          )}

          {availability.hidden ? (
            <BsEyeSlash color="blue" onClick={() => toggleVisibility(false)} />
          ) : (
            <BsEye color="blue" onClick={() => toggleVisibility(true)} />
          )}
        </div>
      </td>
    </tr>
  );
};

export default AvailableListEntry;
