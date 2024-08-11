let currentPage = 1;
let rowsPerPage = 10;
let data = [];
const addModalElement = document.getElementById('addModal');
const addModal = new bootstrap.Modal(addModalElement);
const openModal = document.getElementById('openModal');

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
        <td><input type="checkbox" id="selectBox" onclick="toggleCheckbox(this)"></td>
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

function createArrowButton(type, pageCount, data) {
  let button = document.createElement("li");
  button.classList.add('page-item');
  button.innerHTML = `<a href="#" class="page-link">${type === 'prev' ? '<i class="bi bi-chevron-left"></i>' : '<i class="bi bi-chevron-right"></i>'}</a>`;

  if((type === 'prev' && currentPage === 1) || (type === 'next'&& currentPage === pageCount)) {
    button.classList.add('disabled');
  }

  button.addEventListener('click', function(event) {
    event.preventDefault();
    if(type === 'prev' && currentPage > 1) {
      currentPage--;
    } else if(type === 'next' && currentPage < pageCount) {
      currentPage++;
    }

    displayTable(data, rowsPerPage, currentPage);
    setupPagination(data, rowsPerPage);
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

function addRowFromModal() {
  const form = document.getElementById("addForm");

  if(form.checkValidity()) {
    const table = document.getElementById("styleTable").getElementsByTagName("tbody")[0];
    
    const color = document.getElementById("newColor").value;
    const status = document.getElementById("newStatus").value;
    const descr = document.getElementById("newDescr").value;
    const date = document.getElementById("newDate").value;
  
    let newRow = `
      <tr>
        <td><input type="checkbox"></td>
        <td contenteditable="true">${color}</td>
        <td contenteditable="true">${status}</td>
        <td contenteditable="true">${descr}</td>
        <td contenteditable="true">${date}</td>
      </tr>`;
    
    table.innerHTML += newRow;
  
    addModal.hide();  
    form.reset();
  } else {
    form.reportValidity();
  }
}
