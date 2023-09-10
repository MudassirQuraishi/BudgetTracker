const email = document.getElementById("email");
const password = document.getElementById("password");
const loginbutton = document.getElementById("login-button");
const forgotLink = document.getElementById("forgot-password");

loginbutton.addEventListener("click", userLogin);

async function userLogin(e) {
  e.preventDefault();
  if ((email.value === "") | (password.value === "")) {
    alert("Please enter your credentials");
  } else {
    try {
      const loginDetails = {
        email: email.value,
        password: password.value,
      };
      const response = await axios.post(
        "http://13.211.123.38:3000/user/login",
        loginDetails
      );
      if (response.status === 200) {
        localStorage.setItem("token", response.data.encryptedId);
        localStorage.setItem("isPremium", response.data.isPremium);
        alert("logged in successfully");
        window.location.href = "../Expenses/expenses.html";
      } else if (response.status === 401) {
        alert("Incorrect username or password");
      }
    } catch (error) {
      console.log("User not found");
    }
  }
}
