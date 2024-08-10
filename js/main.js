let currentPage = 1;
let rowsPerPage = 10;
let data = [];

document.addEventListener("DOMContentLoaded", async function() {
  data = await fetchData();
  displayTable(data, rowsPerPage, currentPage);
  setupPagination(data, rowsPerPage);
});

function displayTable(data, rowsPerPage, page) {
  const table = document.getElementById("styleTable").getElementsByTagName('tbody')[0];
  table.innerHTML = '';
  page--;

  let start = rowsPerPage * page;
  let end = start + rowsPerPage;
  let paginatedItems = data.slice(start, end);

  for(let index = 0; index < paginatedItems.length; index++) {
    let row = `
      <tr>
        <td>${paginatedItems[index].styleColor}</td>
        <td>${paginatedItems[index].styleStatus}</td>
        <td>${paginatedItems[index].assortDescr}</td>
        <td>${paginatedItems[index].lastUpdated}</td>
      </tr>
    `;
    table.innerHTML += row;
  }
}

function setupPagination(data, rowsPerPage) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = '';

  let pageCount = Math.ceil(data.length / rowsPerPage);
  for(let index = 1; index < pageCount + 1; index++) {
    let btn = paginationButton(index, data);
    pagination.appendChild(btn);
  }
}

function paginationButton(page, data) {
  let button = document.createElement("li");
  button.classList.add('page-item');
  button.innerHTML = `<a href="#" class="page-link">${page}</a>`;

  if(currentPage== page) {
    button.classList.add('active');
  }

  button.addEventListener('click', function() {
    currentPage = page;
    displayTable(data, rowsPerPage, currentPage);

    let currentBtn = document.querySelector('.pagination li.active');
    currentBtn.classList.remove('active');

    button.classList.add('active');
  });

  return button;
}

function changeRowsPerPage() {
  let rowsPerPage = document.getElementById("rowsPerPage").value;
  displayTable(data, rowsPerPage, currentPage);
  setupPagination(data, rowsPerPage);
}

function sortTable(n) {
  const table = document.getElementById("styleTable");
  let rows, switching, i, x, y, shouldSwitch, dir, switchCount = 0;
  switching = true;
  dir = "asc";

  while(switching) {
    switching = false;
    rows = table.rows;

    for(i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("td")[n];
      y = rows[i + 1].getElementsByTagName("td")[n];

      if(dir == "asc") {
        if(x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      } else if(dir == "desc") {
        if(x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
    }

    if(shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchCount++;
    } else {
      if(switchCount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

function searchTable() {
  const input = document.getElementById("searchInput");
  const filter = input.value.toLowerCase();
  const table = document.getElementById("styleTable");
  const tr = table.getElementsByTagName("tr");

  for(let first_index = 1; first_index < tr.length; first_index++) {
    tr[first_index].style.display = "none";
    const td = tr[first_index].getElementsByTagName("td");

    for(let second_index = 0; second_index < td.length; second_index++) {
      if(td[second_index]) {
        if(td[second_index].innerHTML.toLowerCase().indexOf(filter) > -1) {
          tr[first_index].style.display = "";
          break;
        }
      }
    }
  }
}

function addRow() {
  const table = document.getElementById("styleTable").getElementsByTagName("tbody")[0];
  let newRow = `
    <tr>
      <td contenteditable="true">New Color</td>
      <td contenteditable="true">New Status</td>
      <td contenteditable="true">New Descr</td>
      <td contenteditable="true">New Date</td>
    </tr>`;
    table.innerHTML += newRow;
}
