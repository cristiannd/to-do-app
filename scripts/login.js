window.addEventListener('load', function () {
  const urlBase = 'https://ctd-todo-api.herokuapp.com/v1';
  const formulario = this.document.forms[0];
  const inputEmail = this.document.querySelector('#inputEmail');
  const inputPassword = this.document.querySelector('#inputPassword');

  formulario.addEventListener('submit', e => {
    e.preventDefault();

    validarEmail(inputEmail.value);
    validarPassword(inputPassword.value);

    const payload = {
      email: inputEmail.value,
      password: inputPassword.value,
    }

    fetch(`${urlBase}/users/login`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        'permissions-policy': 'interest-cohort'
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data === 'Contraseña incorrecta') {
          alert('La contraseña es incorrecta')
        } else if (data === 'El usuario no existe') {
          alert('El usuario no existe')
        } else {
          window.sessionStorage.setItem('key', data.jwt)
          document.location.href = '/mis-tareas.html'
        }
      })
      .catch((err) => {
        console.log('Error: ' + err)
      })
  })

  function validarEmail(email) {
    if (email.length === 0) {
      alert('Debes completar el campo email')
    }
  }

  function validarPassword(pass) {
    if (pass.length === 0) {
      alert('Debes completar el campo de contraseña')
    }
  }
})
