const resetButton = document.getElementById("reset-button");

resetButton.addEventListener("click", resetPassword);
//functions
async function resetPassword(e) {
  try {
    e.preventDefault();
    const email = document.getElementById("email");
    if (email.value === "") {
      alert("Please enter your email");
    } else {
      const resetData = {
        email: email.value,
      };
      const response = await axios.post(
        "http://3.106.143.22:3000/password/forgotPassword",
        resetData
      );
      console.log(response);
    }
  } catch (error) {
    console.log("Error Resetting Password:", error.message);
  }
}
