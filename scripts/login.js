/* -------------------------------------------------------------------------- */
/*                   logica aplicada en la pantalla de LOGIN                  */
/* -------------------------------------------------------------------------- */
window.addEventListener('load', function(){

    const formulario =  this.document.forms[0];
    const inputEmail = this.document.querySelector('#inputEmail');
    const inputPassword =  this.document.querySelector('#inputPassword');

    formulario.addEventListener('submit', function(event){
        event.preventDefault();

        validarEmail(inputEmail.value)
        validarPassword(inputPassword.value)
    });

    function validarEmail(email){
        if(email.length === 0) {
            alert("Debes completar el campo email")
        }
    }

    function validarPassword(pass) {
        if(pass.length === 0){
            alert("Debes completar el campo de contraseña")
        }
    }
});