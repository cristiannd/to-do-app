window.addEventListener('load', function(){
  const registro = this.document.forms[0];

  const nombre = document.querySelector("#nombre");
  const apellido = document.querySelector("#apellido");
  const email = document.querySelector("#email");
  const password1 = document.querySelector("#password1");
  const password2 = document.querySelector("#password2");

  registro.addEventListener('submit', function(event){
    event.preventDefault();    
    validarNombre(nombre);
  });

  function validarNombre(nombre) {
    if(nombre.value.length === 0) console.log("El nombre no puede estar vacío");

    for(let i=0; i<nombre.value.length; i++){
      if(nombre.value[i] === "0" || nombre.value[i] === "1" || nombre.value[i] === "2" || nombre.value[i] === "3" || nombre.value[i] === "4" || nombre.value[i] === "5" || nombre.value[i] === "6" || nombre.value[i] === "7" || nombre.value[i] === "8" || nombre.value[i] === "9") console.log("El campo nombre no puede contener números")
    }
  }
})