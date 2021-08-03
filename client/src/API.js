const host = "http://localhost:3000";

const getAvailability = async () => {
  const response = await fetch(host + "/api/avail");
  return await response.json();
};

const sendOrder = async (order) => {
  const response = await fetch(host + "/api/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });
  return await response.json();
};

export { getAvailability, sendOrder };
