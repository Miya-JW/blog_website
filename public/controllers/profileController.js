//----------------------------------------Select avatar popup.------------------------
function showAvatarModal() {
  let modal = document.querySelector("#avatarModal");
  modal.style.display = "block";
}

//Click the cross icon to close the select avatar popup
let span = document.querySelector(".close");
span.onclick = function () {
  let modal = document.querySelector("#avatarModal");
  modal.style.display = "none";
};

//On the profile page, click 'Done' to return to the homepage.
document.querySelector("#done_btn").addEventListener("click", function () {
  window.location.href = "/";
});

//Change password: Click the change button - a confirm button and a new password input field appear, hiding the change button.
function modifyPassword(event, fieldId) {
  event.preventDefault();
  // Display new password and confirm password input fields
  let newPasswordDiv = document.querySelector("#newPasswordDiv");
  let newPasswordConfirmDiv = document.querySelector("#newPasswordConfirmDiv");
  newPasswordDiv.style.display = "block";
  newPasswordConfirmDiv.style.display = "block";

  // Clear the current password input field.
  let currentPasswordInput = document.querySelector(`#${fieldId}`);
  currentPasswordInput.value = "";
  let password = currentPasswordInput.value;

  // Hide the change button, display the confirm button.
  let modifyButton = document.querySelector("#modify_btn");
  let confirmButton = document.querySelector("#confirm_btn");
  modifyButton.style.display = "none";
  confirmButton.style.display = "block";
  confirmButton.disabled = true;

  document
    .querySelector("#password")
    .addEventListener("input", checkPasswordInputs);
  document
    .querySelector("#newPassword")
    .addEventListener("input", checkPasswordInputs);
  document
    .querySelector("#newPasswordConfirm")
    .addEventListener("input", checkPasswordInputs);

  //Check if all password fields are filled out.
  checkPasswordInputs();
}

//Check if all password fields are filled out.
function checkPasswordInputs() {
  //Select password content and confirm button.
  let currentPassword = document.querySelector("#password").value;
  let newPassword = document.querySelector("#newPassword").value;
  let newPasswordConfirm = document.querySelector("#newPasswordConfirm").value;
  let confirmButton = document.querySelector("#confirm_btn");

  //Check if all password input fields are filled; if completed, enable the confirm button
  if (currentPassword && newPassword && newPasswordConfirm) {
    confirmButton.disabled = false;
  } else {
    confirmButton.disabled = true;
  }
}

//--------------------------------------------Password change process----------------------------
async function editField(event, fieldId) {
  let value; // new value
  //--------------------------------------obtain new value-----------------------------------
  // new avatar value
  if (fieldId === "avatar") {
    let src = event.target.src;
    let match = src.match(/\/avatar(\d+)\.jpg$/);
    value = match ? `avatar${match[1]}` : null;

    // new password value
  } else if (fieldId === "password") {
    let oldPassword = document.querySelector("#password").value;
    let newPassword = document.querySelector("#newPassword").value;
    let confirmPassword = document.querySelector("#newPasswordConfirm").value;

    //verify old password
    await fetch("/verify-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: oldPassword }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.isValid) {
          //if old password true-> compare new password & confirmed one
          if (newPassword == confirmPassword) {
            value = confirmPassword;
          } else {
            // passwords do not match
            alert("Passwords do not match.");
          }
        } else {
          // password is incorrect
          // error message
          alert("Password is incorrect.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // new value:username,real name, date of birth, description
  } else {
    value = document.querySelector(`#${fieldId}`).value;
  }

  // Send an update request to the server
  fetchUpdateProfile(fieldId, value);
}

//--------------------------------------update database--------------------
function fetchUpdateProfile(fieldId, value) {
  //In case of password verification failure
  if (value == undefined) {
    alert("Update failed!");
    //Send an update request to the server
  } else {
    fetch("/update-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ field: fieldId, value: value }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        //Update the profile picture on the page.
        if (fieldId == "avatar") {
          completeUpdateAvatar(value);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        if (error.message === "Username already exists") {
          //Display a message that the username already exists
          displayUsernameExistsMessage();
        }
      });
  }
}

//--------------username already exists error-----------------------------
function displayUsernameExistsMessage() {
  const error = document.querySelector("#modify_username_error");
  error.textContent = "Username already exists";
}

//----------Update the profile picture on the page----------------
function completeUpdateAvatar(value) {
  let modal = document.querySelector("#avatarModal");
  modal.style.display = "none";
  let avatar = document.querySelector("#change_avatar");
  avatar.src = `./avatar/${value}.jpg`;
}

//Change the input type when modifying the birthday."
function changeTypeToDate(inputElement) {
  inputElement.type = "date";
}

//-----------------------------delete account -------------
function deleteAccount(event, user_id) {
  //pop-up question
  let userResponse = confirm("Are you sure you want to delete your account?");
  if (userResponse) {
    // When the user clicks “OK”, a request is sent to the server
    fetch("/delete-account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: user_id }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Deletion successful, return to the homepage.
        if (data.isValid == true) {
          alert("Account has been deleted.");
          window.location.href = "/";
        } else {
          alert("Error occurred while deleting the account.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error occurred while deleting the account.");
      });
  } else {
    // The user clicked 'Cancel'.
    console.log("User clicked No.");
  }
}
