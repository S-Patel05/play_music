let uname=document.getElementById('uname')
let email=document.getElementById('email')
let pwd=document.getElementById('pwd')
let btn=document.getElementById('btn')
let registereddate=[]

console.log(registereddate)
let jsondata=localStorage.getItem('registereddate')
console.log(jsondata)
function setupPasswordToggle() {
    const pwdInput = document.getElementById("pwd"); // Ensure it's selected
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
setupPasswordToggle();
btn.addEventListener('click', (e)=>{
    e.preventDefault()
    let jsondata=localStorage.getItem('registereddate')
    let username = uname.value.trim();
    let emailValue = email.value.trim();
    let password = pwd.value.trim();
    console.log(username)
    
    // Validate inputs
    if (username === "" || emailValue === "" || password === "") {
        alert("All fields are required. Please fill in all the details.");
        return;
    }

    if(jsondata){
        registereddate=JSON.parse(jsondata)
        let userdetails=registereddate.find(element=>element.email===email.value)
        if(userdetails){
            alert('alrady register please login!!!')
            uname.value=""
            email.value=""
            password.value=""
            
        }
        else{
            registereddate.push({uname:uname.value,email:email.value,password:pwd.value})
            localStorage.setItem('registereddate', JSON.stringify(registereddate))
            location.href='index.html'
        }
    }
    else{
        registereddate.push({uname:uname.value,email:email.value,password:pwd.value})
        localStorage.setItem('registereddate', JSON.stringify(registereddate))
        location.href='index.html'
    }

})

function handleGoogleRegister(response) {
    const data = parseJwt(response.credential);

    // Get stored registered users
    let registeredUsers = JSON.parse(localStorage.getItem("registereddate")) || [];

    // Check if the user already exists
    let userExists = registeredUsers.find(user => user.email === data.email);

    if (userExists) {
        alert("You are already registered! Please log in.");
        window.location.href = "index.html"; // Redirect to login page
    } else {
        // Save Google user in localStorage
        registeredUsers.push({
            uname: data.name,
            email: data.email,
            password: "google-user" // No password needed for Google users
        });

        localStorage.setItem("registereddate", JSON.stringify(registeredUsers));
        alert("Registration successful! Please log in.");
        window.location.href = "index.html";
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


localStorage.setItem('user', JSON.stringify(uname));