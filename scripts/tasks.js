window.addEventListener("load", function(){
  const formAddTask = document.querySelector("#formulario-agregar-tarea");
  const newTask = document.querySelector("#nuevaTarea");
  const skeleton = document.querySelector("#skeleton");
  const notDone = document.querySelector(".not-done");

  const tareasPendientes = [];
  const tareasTerminadas = [];
  
  formAddTask.addEventListener("submit", e => {
    e.preventDefault();
    const newDate = new Date();

    tareasPendientes.push({
      descripcion: newTask.value,
      date: newDate
    });

    console.log(tareasPendientes)

    skeleton.innerHTML += `
      <li class="tarea">
        <div class="not-done"></div>
        <div class="descripcion">
          <p class="nombre">${newTask.value}</p>
          <p class="timestamp">${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()}</p>
        </div>
      </li>`
  });
})
