const userName = document.getElementById("name");
const userEmail = document.getElementById("email");
const userPassword = document.getElementById("password");
const signupButton = document.getElementById("signup-button");
const login = document.getElementById("login-link");

signupButton.addEventListener("click", userSignup);
async function userSignup(e) {
  e.preventDefault();
  if (
    (userName.value === "") |
    (userEmail.value === "") |
    (userPassword.value === "")
  ) {
    alert("please enter all fields");
  } else {
    try {
      const signupDetails = {
        name: userName.value,
        email: userEmail.value,
        password: userPassword.value,
      };
      const response = await axios.post(
        "http://13.211.123.38:3000/user/signup",
        signupDetails
      );
      if (response.status === 200) {
        alert(response.data.message);
        window.location.href = "../Login/login.html";
      } else if (response.status === 201) {
        alert(response.data.message);
        window.location.href = "../Login/login.html";
      }
    } catch (error) {
      console.log("Error signing up");
    }
  }
}
