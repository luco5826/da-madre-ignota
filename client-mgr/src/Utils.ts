import React from "react";
import { Order, OrderedProduct, UserLoginInfo } from "./commonTypes";

const AuthenticationContext = React.createContext<UserLoginInfo>({
  isLogged: false,
  user: {},
});

const isStringEmpty = (s: string) => s === undefined || s === null || s === "";

const groupOrdersByProduct = (orders: Order[]): OrderedProduct[] => {
  let result: OrderedProduct[] = [];
  for (const order of orders) {
    for (const availability of order.availabilities) {
      const index = result.findIndex(
        (r) => r.id === availability.menu_id && r.day.isSame(availability.day)
      );
      if (index !== -1) {
        result[index].quantity += availability.quantity!;
      } else {
        result.push({
          id: availability.menu_id,
          name: availability.product?.name || "ERRORE",
          description: availability.product?.description || "ERRORE",
          quantity: availability.quantity!,
          day: availability.day,
        });
      }
    }
  }
  return result;
};

export { AuthenticationContext, isStringEmpty, groupOrdersByProduct };
