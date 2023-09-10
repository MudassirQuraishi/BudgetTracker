const rzpBtn = document.getElementById("premium-button");
const logoutButton = document.getElementById("logout");
const itemsPerPage = document.getElementById("per-page");
const userList = document.getElementById("list-group");
const searchButton = document.getElementById("search-link");
const pagination = document.getElementById("pagination-div");
const income = document.getElementById("dash-income");
const expense = document.getElementById("dash-expense");
const savings = document.getElementById("dash-savings");

searchButton.addEventListener("click", setLimit);
rzpBtn.addEventListener("click", razorPay);
logoutButton.addEventListener("click", logout);
window.addEventListener("DOMContentLoaded", loadServer);

async function razorPay(e) {
  e.preventDefault();
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(
      "http://13.211.123.38:3000/purchase/buy-premium",
      { headers: { Authorization: token } }
    );
    await openRazorpay(response.data);
  } catch (error) {
    alert(error.message);
  }
}
const openRazorpay = async (data) => {
  const token = localStorage.getItem("token");
  try {
    const options = {
      key: data.key_id,
      name: "Kharcha Pani",
      description: "Buy Premium",
      order_id: data.order.id,
      handler: async function (response) {
        const update = await axios.post(
          "http://13.211.123.38:3000/purchase/updateMembership",
          {
            order_id: data.order.id,
            payment_id: response.razorpay_payment_id,
          },
          { headers: { Authorization: token } }
        );
        const premiumStatus = update.data.data.isPremium;
        localStorage.setItem("isPremium", premiumStatus);
        if (localStorage.getItem("isPremium") === "true") {
          rzpBtn.innerText = "Premium User";
          rzpBtn.removeEventListener("click", razorPay);
        }
        alert("You are a Premium User Now");
      },
    };
    const rzp = new window.Razorpay(options);
    await rzp.open();

    rzp.on("payment.failed", async (failedData) => {
      const data = await axios.post(
        "http://13.211.123.38:3000/purchase/failed",
        failedData,
        { headers: { Authorization: token } }
      );
    });
  } catch (err) {
    alert("error");
  }
};
function logout(e) {
  localStorage.clear();
  alert("Are you sure you want to log out");
  window.location.href = "../Login/login.html";
}
async function loadServer(e) {
  e.preventDefault();
  const premiumStatus = localStorage.getItem("isPremium");
  const limit = localStorage.getItem("limit");
  itemsPerPage.value = limit;
  const defaultPage = 1;
  await getPagination(defaultPage);
  if (limit) {
    itemsPerPage.value = limit;
  } else {
    itemsPerPage.value = "3";
  }
  if (premiumStatus === "false") {
    showLeaderboardButton.disabled = true;
    downloadButton.disabled = true;
  } else {
    rzpBtn.innerText = "Premium User";
    rzpBtn.removeEventListener("click", razorPay);
  }
  await updateDashboard();
  await getPreviousDownloads();
}
async function setLimit(e) {
  const limit = itemsPerPage.value;
  localStorage.setItem("limit", limit);
  const defaultPage = 1;
  await getPagination(defaultPage);
}
async function getPagination(page) {
  try {
    const currentPage = page;
    const count = localStorage.getItem("limit");
    const token = localStorage.getItem("token");
    userList.innerHTML = "";
    const response = await axios.get(
      `http://13.211.123.38:3000/expense/paginatedExpense?count=${count}&page=${currentPage}`,
      { headers: { Authorization: token } }
    );
    console.log(response.data);
    await showPagination(response.data.data);
    await sendToUi(response.data.data.pageData);
  } catch (error) {
    console.log("error getting expenses");
  }
}
async function sendToUi(data) {
  if (data.length < 1) {
    console.log("No user found");
  } else {
    for (let i = 0; i < 5; i++) {
      if (data[i] !== undefined) {
        createLiElement(data[i]);
      }
    }
  }
}
function createLiElement(userData) {
  const li = document.createElement("li");
  const div = document.createElement("div");
  div.className = "button-group";
  li.appendChild(
    document.createTextNode(
      `Price: ${userData.price}----Description: ${userData.description}----Category: ${userData.category}`
    )
  );
  var delbtn = document.createElement("button");
  delbtn.type = "button";
  delbtn.className = "delete";
  delbtn.id = "deleteButton";
  delbtn.appendChild(document.createTextNode("Delete"));
  div.appendChild(delbtn);
  var editBtn = document.createElement("button");
  editBtn.type = "button";
  editBtn.className = "edit";
  editBtn.id = "editButton";
  editBtn.appendChild(document.createTextNode("Edit"));
  div.appendChild(editBtn);

  li.appendChild(div);

  userList.appendChild(li);

  //event listener to delete an expense when clicked on delete
  delbtn.onclick = async (e) => {
    console.log(userData);
    const token = localStorage.getItem("token");
    const premiumStatus = localStorage.getItem("isPremium");
    const target = e.target.parentElement.parentElement;
    try {
      const id = userData.id;
      const user = await axios.delete(
        `http://13.211.123.38:3000/expense/delete-expense/${id}`,
        { headers: { Authorization: token } }
      );
      userList.removeChild(target);
      // getExpenses();
      // if (premiumStatus === "true" && leaderboard.disabled == true) {
      //   showLeaderboard();
      // }
    } catch (e) {
      alert(`Error deleting expense : ${e.message}`);
    }
  };

  // //event listener to edit expense data when clicked on edit
  editBtn.onclick = async (e) => {
    console.log(userData);
    const token = localStorage.getItem("token");
    const target = e.target.parentElement.parentElement;
    try {
      expenseAmount.value = userData.price;
      description.value = userData.description;
      category.value = userData.category;
      const options = category.options;
      for (let i = 0; i < options.length; i++) {
        if (options[i].text === userData.category) {
          category.selectedIndex = i;
          break;
        }
      }
      addButton.removeEventListener("click", addExpense);
      addButton.addEventListener("click", async (e) => {
        e.preventDefault();
        try {
          const id = userData.id;
          const updatedData = {
            price: expenseAmount.value,
            description: description.value,
            category: category.value,
          };
          console.log(updatedData);
          const user = await axios.put(
            `http://13.211.123.38:3000/expense/edit-expense/${id}`,
            updatedData,
            { headers: { Authorization: token } }
          );
          const premiumStatus = localStorage.getItem("isPremium");
          userList.removeChild(target);
          createLiElement(user.data);
          // if (premiumStatus === "true" && leaderboard.disabled == true) {
          //   showLeaderboard();
          // }
        } catch (error) {
          alert(`Error updating expense : ${error.message}`);
        }
      });
    } catch (error) {
      alert(`Error editing user: ${error.message}`);
    }
  };
}

async function showPagination(data) {
  const {
    currentpage,
    nextPage,
    previousPage,
    hasNextPage,
    hasPreviousPage,
    lastPage,
  } = data;
  console.log(
    currentpage,
    nextPage,
    previousPage,
    hasNextPage,
    hasPreviousPage,
    lastPage
  );
  pagination.innerHTML = "";

  if (hasPreviousPage) {
    const previousButton = document.createElement("button");
    previousButton.innerHTML = "Previous";
    previousButton.setAttribute("type", "submit");
    previousButton.classList.add("prevButton");
    previousButton.id = "prevButton";
    previousButton.addEventListener("click", async () => {
      await getPagination(previousPage);
    });
    pagination.appendChild(previousButton);
  }

  const currbtn = document.createElement("button");
  currbtn.innerHTML = currentpage;
  currbtn.classList.add("currentPage");
  currbtn.id = "currentPage";
  currbtn.addEventListener("click", () => {
    if (currentpage == lastPage) {
      getPagination(1);
    }
  });
  pagination.appendChild(currbtn);

  if (hasNextPage) {
    const nextButton = document.createElement("button");
    nextButton.innerHTML = "Next";
    nextButton.setAttribute("type", "submit");
    nextButton.classList.add("nextButton");
    nextButton.id = "nextButton";
    nextButton.addEventListener("click", async () => {
      await getPagination(nextPage);
    });
    pagination.appendChild(nextButton);
  }
}
async function getPreviousDownloads(e) {
  const token = localStorage.getItem("token");
  try {
    console.log(token);
    const response = await axios.get(
      "http://13.211.123.38:3000/premium/get-previous-reports",
      {
        headers: { Authorization: token },
      }
    );
    for (let i = 0; i < response.data.response.length; i++) {
      const data = {
        url: response.data.response[i].fileUrl,
        date: response.data.response[i].createdAt.slice(0, 10),
      };
      const existingLinks =
        document.getElementById("dashboard-list").childElementCount;
      if (existingLinks < 5) {
        createLink(data);
      }
    }
  } catch (error) {}
}
function createLink(data) {
  const container = document.getElementById("dashboard-list");
  const li = document.createElement("li");
  li.innerHTML = `Report created on ${data.date} <a href="${data.url}">Download</a>`;
  container.appendChild(li);
}
async function updateDashboard() {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      "http://13.211.123.38:3000/premium/dashboard",
      { headers: { Authorization: token } }
    );
    console.log(response.data.data);
    const expenseData = {
      income: response.data.data.income,
      expense: response.data.data.totalExpense,
    };
    income.innerText = `Income this month: ${expenseData.income}`;
    expense.innerText = `Expense this month: ${expenseData.expense}`;
    const savingsValue = expenseData.income - expenseData.expense;
    savings.innerText = `Savings this month: ${savingsValue}`;

    // Update the style based on the savings value
    if (savingsValue < 1000) {
      savings.style.backgroundColor = "red";
      savings.style.color = "white";
    } else if (savingsValue > 1000 && savingsValue <= 20000) {
      savings.style.backgroundColor = "orange";
      savings.style.color = "white";
    } else {
      savings.style.backgroundColor = "green";
      savings.style.color = "white";
    }
  } catch (error) {
    console.log("error updating dashboard");
  }
}
