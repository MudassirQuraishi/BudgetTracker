// JavaScript to handle modal functionality
const description = document.getElementById("expense-description");
const expenseAmount = document.getElementById("expense-amount");
const category = document.getElementById("category");
const addButton = document.getElementById("expense-button");
const userList = document.getElementById("user-list");
const rzpBtn = document.getElementById("premium-button");
const showLeaderboardButton = document.getElementById("showLeaderboard");
const downloadButton = document.getElementById("download-report");
const logoutButton = document.getElementById("logout");
const leaderboardModal = document.getElementById("leaderboardModal");
const closeModalButton = document.getElementById("closeModal");
const leaderboardList = document.getElementById("leaderboardList");
const manageExpenseButton = document.getElementById("manage-link");
const incomeButton = document.getElementById("add-income");

addButton.addEventListener("click", addExpense);
window.addEventListener("DOMContentLoaded", loadServer);
rzpBtn.addEventListener("click", razorPay);
downloadButton.addEventListener("click", downloadReport);
logoutButton.addEventListener("click", logout);
showLeaderboardButton.addEventListener("click", showModal);
closeModalButton.addEventListener("click", closeModal);
incomeButton.addEventListener("click", addIncome);
// window.addEventListener("click", (event) => {
//   if (event.target === leaderboardModal) {
//     leaderboardModal.style.display = "none";
//   }
// });
manageExpenseButton.addEventListener("click", openPage);
async function addIncome(e) {
  e.preventDefault();
  const token = localStorage.getItem("token");
  const income = document.getElementById("income-amount");
  const incomeDes = document.getElementById("income-description");
  if (income.value === "") {
    console.log("please enter income");
  } else {
    const incomeDetails = {
      amount: income.value,
      description: incomeDes.value,
    };
    console.log(token);
    const response = await axios.post(
      "http://13.211.123.38:3000/expense/add-income",
      incomeDetails,
      { headers: { Authorization: token } }
    );
    console.log(response);
  }
}
function openPage(e) {
  e.preventDefault;
  console.log("button clicked");
  const premiumStatus = localStorage.getItem("isPremium");
  if (premiumStatus === "true") {
    window.location.href = "../Manage/manage.html";
  } else {
    alert("Please buy premium to manage expenses");
  }
}
async function addExpense(e) {
  e.preventDefault();
  if ((expenseAmount.value === "") | (category.value === "")) {
    alert("please select fields");
  } else {
    try {
      const token = localStorage.getItem("token");
      const expenseDetails = {
        description: description.value,
        amount: expenseAmount.value,
        category: category.value,
      };
      const response = await axios.post(
        "http://13.211.123.38:3000/expense/add-expense",
        expenseDetails,
        { headers: { Authorization: token } }
      );
      if (userList.childElementCount < 5) {
        createLiElement(response.data);
      } else {
        description.value = "";
        expenseAmount.value = "";
        category.selectedIndex = 0;
      }
    } catch (error) {
      console.log("error adding expense");
    }
  }
}
async function getExpenses() {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      "http://13.211.123.38:3000/expense/get-expense",
      { headers: { Authorization: token } }
    );
    sendToUi(response.data);
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
async function createLiElement(userData) {
  const li = document.createElement("li");
  const div = document.createElement("div");
  div.className = "button-group";
  li.appendChild(
    document.createTextNode(
      `${userData.price} spent on ${userData.description} `
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
  description.value = "";
  expenseAmount.value = "";
  category.selectedIndex = 0;

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
        } catch (error) {
          alert(`Error updating expense : ${error.message}`);
        }
      });
    } catch (error) {
      alert(`Error editing user: ${error.message}`);
    }
  };
}
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
async function loadServer(e) {
  e.preventDefault();
  const premiumStatus = localStorage.getItem("isPremium");
  if (premiumStatus === "false") {
    showLeaderboardButton.disabled = true;
    downloadButton.disabled = true;
  } else {
    rzpBtn.innerText = "Premium User";
    rzpBtn.removeEventListener("click", razorPay);
  }
  await getExpenses();
}
async function downloadReport(e) {
  e.preventDefault();
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      "http://13.211.123.38:3000/premium/downloadReport",
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (response.status === 200) {
      console.log(response);
      const a = document.createElement("a");
      a.href = response.data.fileURL.Location;
      a.download = "myExpense.csv";
      a.click();
    } else {
      console.log("error downlodaing expense file");
    }
  } catch (error) {
    console.log(error);
  }
}
function logout(e) {
  localStorage.clear();
  alert("Are you sure you want to log out");
  window.location.href = "../Login/login.html";
}
function showModal(e) {
  leaderboardModal.style.display = "block";
  populateLeaderboard();
}
function closeModal(e) {
  leaderboardModal.style.display = "none";
}
async function populateLeaderboard() {
  const token = localStorage.getItem("token");
  const premiumStatus = localStorage.getItem("isPremium");

  try {
    const response = await axios.get(
      "http://13.211.123.38:3000/premium/showLeaderboard",
      {
        headers: { Authorization: token },
      }
    );
    if (premiumStatus === "true") {
      leaderboardList.innerHTML = "";
      const userData = response.data.leaderboardData;
      userData.forEach((user) => {
        const li = document.createElement("li");
        li.textContent = `Name:${user.data.userName}--Expense :${user.data.totalExpense}`;
        leaderboardList.appendChild(li);
      });
    } else {
      showLeaderboardButton.removeEventListener("click", showModal);
      showLeaderboardButton.addEventListener("click", (e) => {
        console.log("working");
        alert("Not a premium user");
      });
    }
  } catch (error) {
    alert(error.message);
  }
}
