window.addEventListener('load', function(){
  const register = document.forms[0];
  const url = "https://ctd-todo-api.herokuapp.com/v1"

  const firstName = document.querySelector("#nombre");
  const lastName = document.querySelector("#apellido");
  const email = document.querySelector("#email");
  const password1 = document.querySelector("#password1");
  const password2 = document.querySelector("#password2");
  
  const errorName = document.querySelector("#errorName");
  const errorLastName = document.querySelector("#errorLastName");
  const errorEmail = document.querySelector("#errorEmail");
  const errorPassword1 = document.querySelector("#errorMessagePass1");
  const errorPassword2 = document.querySelector("#errorMessagePass2");

  const userRegister = {
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  }

  register.addEventListener('submit', e => {
    e.preventDefault();  
    
    isFirstNameValid();
    isLastNameValid();
    isEmailValid();
    isPasswordValid();

    succesfulRegistration();
  });
  
  const isFirstNameValid = () => {
    if(firstName.value.length === 0) {
      errorName.innerText = "El campo no puede quedar vacío";
    } else {
      errorName.innerText = "";
      userRegister.firstName = firstName.value;
    }
  }
  
  const isLastNameValid = () => {
    if(lastName.value.length === 0) {
      errorLastName.innerText = "El campo no puede quedar vacío";
    } else {
      errorLastName.innerText = "";
      userRegister.lastName = lastName.value;
    }
  }
  
  const isEmailValid = () => {
    if(email.value.length === 0) {
      errorEmail.innerText = "El campo no puede quedar vacío";
    } else {
      errorEmail.innerText = "";
      userRegister.email = email.value;
    }
  }
  
  const isPasswordValid = () => {
    if(password1.value.length === 0) {
      errorPassword1.innerText = "El campo no puede quedar vacío";
    } else {
      errorPassword1.innerText = "";
    }
  
    if(password2.value.length === 0) {
      errorPassword2.innerText = "El campo no puede quedar vacío";
      return;
    } else {
      errorPassword2.innerText = "";
    }

    if(password1.value !== password2.value) {
      errorPassword1.innerText = "Las contraseñas deben coincidir";
      errorPassword2.innerText = "Las contraseñas deben coincidir";
      return;
    } else {
      errorPassword1.innerText = "";
      errorPassword2.innerText = "";
      userRegister.password = password2.value;
    }
  }

  const succesfulRegistration = () => {
    if(userRegister.firstName.length > 0 && userRegister.lastName.length > 0 && userRegister.email.length > 0 && userRegister.password.length > 0) {
      const settings = {
        method: "POST",
        body: JSON.stringify(userRegister),
        headers: {
          "Content-Type": "application/json"
        }
      }
      
      fetch(`${url}/users`, settings)
        .then(res => res.json())
        .then(res => {
          if(res === "El usuario ya se encuentra registrado") {
            errorEmail.innerText = "El email ya se encuentra en uso"
          } else {
            sessionStorage.setItem("key", res.jwt);
            // errorEmail.innerText = ""
            // register.reset();
            
            fetch(`${url}/tasks`, {
              method: "GET",
              headers: {
                "authorization": res.jwt
              }
            })
            .then(res => res.json)
            .then(res => {
              console.log(res)
              // window.location.pathname = "/mis-tareas.html";
            })
            .catch(err => console.log("Error: " + err))
          }
        })
        .catch(err => {
          console.log("Error: " + err);
        })
    }
  }
})