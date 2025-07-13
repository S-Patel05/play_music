function setupPasswordToggle() {
  const pwdInput = document.getElementById("pwd");
  const passwordContainer = pwdInput.parentNode;

  let toggleButton = passwordContainer.querySelector(".password-toggle");
  if (!toggleButton) {
      toggleButton = document.createElement("button");
      toggleButton.type = "button";
      toggleButton.className = "password-toggle";
      toggleButton.innerHTML = "SHOW";

      passwordContainer.appendChild(toggleButton);

      toggleButton.addEventListener("click", function () {
          const type = pwdInput.getAttribute("type") === "password" ? "text" : "password";
          pwdInput.setAttribute("type", type);
          toggleButton.innerHTML = type === "password" ? "SHOW" : "HIDE";
      });
  }
}

document.addEventListener('DOMContentLoaded', () => {

        // 🎭 Fade-In Effect for Login Card
        const loginCard = document.querySelector(".login-card");
        loginCard.style.opacity = "0";
        loginCard.style.transform = "translateY(-20px)";
    
        setTimeout(() => {
            loginCard.style.transition = "all 1s ease-in-out";
            loginCard.style.opacity = "1";
            loginCard.style.transform = "translateY(0)";
        }, 300);
    
  let registeredData = JSON.parse(localStorage.getItem('registereddate')) || [];
    console.log(registeredData)
  const email = document.getElementById('email');
  const pwd = document.getElementById('pwd');
  const btn = document.getElementById('btn');

  setupPasswordToggle();

  btn.addEventListener('click', (e) => {
      e.preventDefault();

      const emailValue = email.value.trim();
      const passwordValue = pwd.value.trim();

      if (emailValue === "" || passwordValue === "") {
          alert("All fields are required. Please fill in all the details.");
          return;
      }

      const userDetails = registeredData.find((element) => 
          element.email === emailValue && element.password === passwordValue
      );

      if (userDetails) {
          localStorage.setItem('username', userDetails.uname);
          localStorage.setItem('email', userDetails.email);
          window.location.href = 'home.html';
      } else {
          alert("Your email or password is incorrect.");
      }
  });
});

function handleCredentialResponse(response) {
    const data = parseJwt(response.credential);

    // Get stored registered users
    let registeredUsers = JSON.parse(localStorage.getItem("registereddate")) || [];

    // Check if the user exists
    let userExists = registeredUsers.find(user => user.email === data.email);

    if (userExists) {
        // Save user info in localStorage
        localStorage.setItem("user", JSON.stringify(data));

        // Redirect to home page
        window.location.href = "home.html";
    } else {
        alert("You are not registered! Please register first.");
    }
}

// Function to decode Google JWT Token
function parseJwt(token) {
    let base64Url = token.split(".")[1];
    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    let jsonPayload = decodeURIComponent(atob(base64).split("").map(c =>
        "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(""));

    return JSON.parse(jsonPayload);
}



