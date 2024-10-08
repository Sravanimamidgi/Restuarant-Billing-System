const tables = [
  { id: 1, name: "Table-1", totalCost: 0, totalItems: 0, orders: [] },
  { id: 2, name: "Table-2", totalCost: 0, totalItems: 0, orders: [] },
  { id: 3, name: "Table-3", totalCost: 0, totalItems: 0, orders: [] }
];

const menuItems = [
  { id: 1, name: "Idly", type: "Breakfast", price: 150.00 },
  { id: 2, name: "Omelette", type: "Breakfast", price: 120.00 },
  { id: 3, name: "Dosa", type: "Breakfast", price: 130.00 },
  { id: 4, name: "Pancakes", type: "Breakfast", price: 180.00 },
  { id: 5, name: "Grilled Chicken", type: "Main Course", price: 250.00 },
  { id: 6, name: "Biryani", type: "Main Course", price: 200.00 },
  { id: 7, name: "Sambar Rice", type: "Main Course", price: 300.00 },
  { id: 8, name: "Paratha", type: "Main Course", price: 180.00 },
  { id: 9, name: "Chocolate Cake", type: "Desserts", price: 150.00 },
  { id: 10, name: "Cheesecake", type: "Desserts", price: 160.00 },
  { id: 11, name: "Ice Cream Sundae", type: "Desserts", price: 120.00 },
  { id: 12, name: "Death By Chocolate", type: "Desserts", price: 170.00 },
  { id: 13, name: "Spring Rolls", type: "Appetizers", price: 100.00 },
  { id: 14, name: "Garlic Bread", type: "Appetizers", price: 90.00 },
  { id: 15, name: "Bruschetta", type: "Appetizers", price: 120.00 },
  { id: 16, name: "Stuffed Mushrooms", type: "Appetizers", price: 130.00 },
  { id: 17, name: "Coke", type: "Beverages", price: 50.00 },
  { id: 18, name: "Lemonade", type: "Beverages", price: 60.00 },
  { id: 19, name: "Iced Tea", type: "Beverages", price: 70.00 },
  { id: 20, name: "Smoothie", type: "Beverages", price: 80.00 }
];

document.addEventListener("DOMContentLoaded", () => {
  const tableContainer = document.getElementById("tables");
  const menuContainer = document.getElementById("menu");
  const tableSearch = document.getElementById("tableSearch");
  const menuSearch = document.getElementById("menuSearch");
  const orderModal = document.getElementById("orderModal");
  const closeModalButton = document.getElementById("closeModal");
  const clearTableSearch = document.getElementById("clearTableSearch");
  const clearMenuSearch = document.getElementById("clearMenuSearch");

  let currentTableId;

  const renderTables = (tablesToRender) => {
    tableContainer.innerHTML = "";
    tablesToRender.forEach(table => {
      const tableDiv = document.createElement("div");
      tableDiv.classList.add("table");
      tableDiv.dataset.id = table.id;
      tableDiv.innerHTML = `
        <h3>${table.name}</h3>
        <p>Rs.${table.totalCost.toFixed(2)} | Total items: ${table.totalItems}</p>
      `;
      tableDiv.addEventListener("click", () => showOrderDetails(table.id));
      tableContainer.appendChild(tableDiv);
    });
  };

  const renderMenu = (items) => {
    const menuLeft = document.getElementById("menuLeft");
    const menuRight = document.getElementById("menuRight");

    menuLeft.innerHTML = "";
    menuRight.innerHTML = "";

    items.forEach((item, index) => {
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("menu-item");
      itemDiv.setAttribute("draggable", "true");
      itemDiv.setAttribute("data-id", item.id);
      itemDiv.innerHTML = `
        <img src="image/${item.name.toLowerCase()}.jpg" alt="${item.name}" class="menu-item-image">
        <div class="menu-item-details">
          <span class="item-name">${item.name}</span>
          <span class="item-price">Rs.${item.price.toFixed(2)}</span>
        </div>
      `;
      itemDiv.addEventListener("dragstart", handleDragStart);

      if (index % 2 === 0) {
        menuLeft.appendChild(itemDiv);
      } else {
        menuRight.appendChild(itemDiv);
      }
    });
  };

  const handleDragStart = (event) => {
    event.dataTransfer.setData("text/plain", event.target.getAttribute("data-id"));
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const menuItemId = event.dataTransfer.getData("text/plain");
    const tableId = event.target.closest(".table").dataset.id;
    addMenuItemToTable(parseInt(menuItemId), parseInt(tableId));
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const addMenuItemToTable = (menuItemId, tableId) => {
    const menuItem = menuItems.find(item => item.id === menuItemId);
    const table = tables.find(table => table.id === tableId);

    const existingOrder = table.orders.find(order => order.item.id === menuItem.id);
    if (existingOrder) {
      existingOrder.quantity += 1;
    } else {
      table.orders.push({ item: menuItem, quantity: 1 });
    }

    table.totalCost += menuItem.price;
    table.totalItems += 1;
    renderTables(tables);
  };

  const generateBill = () => {
    const table = tables.find(table => table.id === currentTableId);
    let billDetails = `
      <h2>Bill Details for ${table.name}</h2>
      <hr>
      <table border="1" cellspacing="0" cellpadding="5" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Item</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
    `;

    let totalCost = 0;
    table.orders.forEach((order, index) => {
      const itemCost = order.item.price * order.quantity;
      totalCost += itemCost;
      billDetails += `
        <tr>
          <td>${index + 1}</td>
          <td>${order.item.name}</td>
          <td>Rs.${order.item.price.toFixed(2)}</td>
          <td>${order.quantity}</td>
          <td>Rs.${itemCost.toFixed(2)}</td>
        </tr>
      `;
    });

    billDetails += `
        </tbody>
      </table>
      <hr>
      <h3>Total Cost: Rs.${totalCost.toFixed(2)}</h3>
    `;

    const billWindow = window.open('', '', 'height=500,width=500');
    billWindow.document.write('<html><head><title>Bill</title></head><body>');
    billWindow.document.write(billDetails);
    billWindow.document.write('</body></html>');
    billWindow.document.close();
    billWindow.print();

    // Clear the table after bill generation
    table.totalCost = 0;
    table.totalItems = 0;
    table.orders = [];
    renderTables(tables);
    orderModal.style.display = "none";
  };

  const showOrderDetails = (tableId) => {
    currentTableId = tableId;
    const table = tables.find(table => table.id === tableId);
    const orderDetailsDiv = document.getElementById("orderDetails");
    orderDetailsDiv.innerHTML = `
      <h4 style="background-color: lightblue; padding: 10px;">Order Details for ${table.name}</h4>
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Item</th>
            <th>Price</th>
            <th>Number of Servings</th>
            <th>Total Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${table.orders.map((order, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${order.item.name}</td>
              <td>Rs.${order.item.price.toFixed(2)}</td>
              <td>${order.quantity}</td>
              <td>Rs.${(order.item.price * order.quantity).toFixed(2)}</td>
              <td>
                <button class="delete-order-item" data-table-id="${tableId}" data-item-id="${order.item.id}">Delete</button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
      <button id="generateBillButton">Generate Bill</button>
    `;

    document.getElementById("generateBillButton").addEventListener("click", generateBill);
    orderModal.style.display = "block";

    document.querySelectorAll(".delete-order-item").forEach(button => {
      button.addEventListener("click", (e) => {
        const tableId = parseInt(e.target.dataset.tableId);
        const itemId = parseInt(e.target.dataset.itemId);
        removeOrderItem(tableId, itemId);
      });
    });
  };

  const removeOrderItem = (tableId, itemId) => {
    const table = tables.find(table => table.id === tableId);
    const orderIndex = table.orders.findIndex(order => order.item.id === itemId);
    if (orderIndex !== -1) {
      const order = table.orders[orderIndex];
      table.totalCost -= order.item.price * order.quantity;
      table.totalItems -= order.quantity;
      table.orders.splice(orderIndex, 1);
      renderTables(tables);
      showOrderDetails(tableId);
    }
  };

  closeModalButton.addEventListener("click", () => {
    orderModal.style.display = "none";
  });

  tableContainer.addEventListener("dragover", handleDragOver);
  tableContainer.addEventListener("drop", handleDrop);

  tableSearch.addEventListener("input", (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredTables = tables.filter(table =>
      table.name.toLowerCase().includes(searchTerm)
    );
    renderTables(filteredTables);
  });

  menuSearch.addEventListener("input", (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredItems = menuItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm) ||
      item.type.toLowerCase().includes(searchTerm)
    );
    renderMenu(filteredItems);
  });

  clearTableSearch.addEventListener("click", () => {
    tableSearch.value = "";
    renderTables(tables);
  });

  clearMenuSearch.addEventListener("click", () => {
    menuSearch.value = "";
    renderMenu(menuItems);
  });

  renderTables(tables);
  renderMenu(menuItems);
});
