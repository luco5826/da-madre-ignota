const getAvailability = async () => {
  const response = await fetch("http://localhost:3000/api/avail");
  const json = response.json();
  return json;
};

export { getAvailability };
