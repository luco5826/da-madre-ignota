const getAvailability = async () => {
  const response = await fetch("http://localhost:3000/api/avail");
  return await response.json();
};

export { getAvailability };
