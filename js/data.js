async function fetchData() {
  const response = await fetch('data.json');
  return response.json();
}
