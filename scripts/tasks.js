window.addEventListener('load', function () {
  const sessionKey = window.sessionStorage.getItem('key');
  const urlBase = 'https://ctd-todo-api.herokuapp.com/v1';
  const formAddTask = document.querySelector('#formulario-agregar-tarea');
  const newTask = document.querySelector('#nuevaTarea');
  const skeletonPending = document.querySelector('.tareas-pendientes .skeleton');
  const skeletonCompleted = document.querySelector('.tareas-terminadas .skeleton');
  const nodoUserName = document.querySelector('.user-info p');
  const nodoUserImage = document.querySelector('.user-info .user-image');
  const nodoUserImage2 = document.querySelector("#formulario-agregar-tarea > div");
  const nodoCloseSession = document.querySelector('.user-info #closeApp');
  let arrPending = [];
  let arrCompleted = [];

  const getUser = url => {
    const parameters = {
      headers: {
        authorization: sessionKey,
      }
    };

    fetch(`${url}/users/getMe`, parameters)
      .then(res => res.json())
      .then(data => {
        nodoUserName.innerText = `${data.firstName} ${data.lastName}`;
        nodoUserImage.innerText = data.firstName[0] + data.lastName[0];
        nodoUserImage2.innerHTML = data.firstName[0] + data.lastName[0];
      })
      .catch(err => console.log(err))
  };

  const getTasks = url => {
    skeletonPending.innerHTML = '';
    skeletonCompleted.innerHTML = '';

    const parameters = {
      headers: {
        authorization: sessionKey
      }
    }

    fetch(`${url}/tasks`, parameters)
      .then(res => res.json())
      .then(data => {
        arrPending = [];
        arrCompleted = [];

        data.forEach(e => {
          if(e.completed === true){
            arrCompleted.push(e);
          } else {
            arrPending.push(e);
          }
        })
      })
      .then(() => renderTasks(arrPending, arrCompleted))
      .catch(err => console.log(err))
  };

  const renderTasks = (taskPending, taskCompleted) => {
    skeletonPending.innerHTML = '';
    skeletonCompleted.innerHTML = '';

    taskPending.forEach(e => {
      const date = new Date(e.createdAt);
      const day = date.getDate();
      const mouth = date.getMonth() + 1;
      const year = date.getFullYear();

      skeletonPending.innerHTML += `
        <li class="tarea">
          <div class="not-done change" id=${e.id}></div>
          <div class="descripcion">
            <p class="nombre">${e.description}</p>
            <p class="timestamp">${day}/${mouth}/${year}</p>
          </div>
        </li>`
    });

    taskCompleted.forEach(e => {
      skeletonCompleted.innerHTML += `
        <li class="tarea">
          <div class="done"></div>
          <div class="descripcion">
            <p class="nombre">${e.description}</p>
            <div>
              <button><i id="${e.id}" class="fas fa-undo-alt change"></i></button>
              <button><i id="${e.id}" class="far fa-trash-alt delete"></i></button>
            </div>
          </div>
        </li>`
    });
  }

  const createTask = (url, taskDescription, key) => {
    const payload = {
      description: taskDescription,
      completed: false
    }

    const parameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': key,
      },
      body: JSON.stringify(payload)
    }

    fetch(`${url}/tasks`, parameters)
      .then(res => res.json())
      .then(() => {
        getTasks(url);
      })
      .catch(err => console.log(err))
  };

  const changeTask = (url, id, key, completed) => {
    const payload = { completed: completed };

    const parameters = {
      method: 'PUT',
      headers: {
        'authorization': key,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    };

    fetch(`${url}/tasks/${id}`, parameters)
      .then(() => {
        const auxPending = [];
        const auxCompleted = [];

        arrPending.forEach(e => {
          if(e.id !== parseInt(id)){
            auxPending.push(e)
          } else {
            auxCompleted.push(e)
          }
        });

        arrCompleted.forEach(e => {
          if(e.id === parseInt(id)){
            auxPending.push(e)
          } else {
            auxCompleted.push(e)
          }
        });

        arrPending = auxPending;
        arrCompleted = auxCompleted;
        renderTasks(arrPending, arrCompleted);
      })
      .catch(err => console.log(err))
  };

  const deleteTask = (url, id, key) => {
    const parameters = {
      method: 'DELETE',
      headers: {
        'authorization': key
      }
    };

    fetch(`${url}/tasks/${id}`, parameters)
      .then(() => {
        const auxCompleted = [];
        arrCompleted.forEach(e => {
          if(e.id !== parseInt(id)){
            auxCompleted.push(e)
          }
        })

        arrCompleted = auxCompleted;
        renderTasks(arrPending, arrCompleted);
      })
      .catch(err => console.log(err))
  };



  document.addEventListener('click', e => {
    const idFocus = e.target.id;

    if(e.target.classList.contains('change') && e.target.classList.contains('fas')) {
      changeTask(urlBase, idFocus, sessionKey, false);
    } else if(e.target.classList.contains('change') && e.target.classList.contains('not-done')) {
      changeTask(urlBase, idFocus, sessionKey, true);
    } else if(e.target.classList.contains('delete')) {
      deleteTask(urlBase, idFocus, sessionKey);
      renderTasks(arrPending, arrCompleted);
    }
  })

  nodoCloseSession.addEventListener('click', () => {
    if(confirm("¿Desea cerra sesión?")) {
      sessionStorage.removeItem('key');
      location.href = '/index.html';
    }
  });

  formAddTask.addEventListener('submit', e => {
    e.preventDefault();
    createTask(urlBase, newTask.value, sessionKey);
    formAddTask.reset();
  });

  getUser(urlBase);
  getTasks(urlBase);
});