window.addEventListener('load', function () {
  const sessionKey = window.sessionStorage.getItem('key');
  const urlBase = 'https://ctd-todo-api.herokuapp.com/v1';
  const formAddTask = document.querySelector('#formulario-agregar-tarea');
  const newTask = document.querySelector('#nuevaTarea');
  const skeletonPending = document.querySelector('.tareas-pendientes #skeleton');
  const skeletonCompleted = document.querySelector('.tareas-terminadas #skeleton');
  const nodoUserName = document.querySelector('.user-info p');
  const nodoCloseSession = document.querySelector('.user-info #closeApp');
  let arrPending = [];
  let arrCompleted = [];
  const skeleton = document.querySelectorAll('#skeleton');

  const getUser = url => {
    const parameters = {
      headers: {
        authorization: sessionKey,
      }
    };

    fetch(`${url}/users/getMe`, parameters)
      .then(res => res.json())
      .then(data => nodoUserName.innerText = `${data.firstName} ${data.lastName}`)
      .catch(err => console.log(err))
  };

  // const getTasks = url => {
  //   const parameters = {
  //     headers: {
  //       authorization: sessionKey,
  //     }
  //   }

  //   fetch(`${url}/tasks`, parameters)
  //     .then(res => res.json())
  //     .then(data => {
  //       skeletonCompleted.innerHTML = '';
  //       skeletonPending.innerHTML = '';

  //       data.forEach(e => {
  //         const date = new Date(e.createdAt);
  //         const day = date.getDate();
  //         const mouth = date.getMonth() + 1;
  //         const year = date.getFullYear();

  //         if (e.completed === false) {
  //           skeletonPending.innerHTML += `
  //             <li class="tarea change" id=${e.id}>
  //               <div class="not-done"></div>
  //               <div class="descripcion">
  //                 <p class="nombre">${e.description}</p>
  //                 <p class="timestamp">${day}/${mouth}/${year}</p>
  //               </div>
  //             </li>`
  //         } else {
  //           skeletonCompleted.innerHTML += `
  //           <li class="tarea">
  //             <div class="done"></div>
  //             <div class="descripcion">
  //               <p class="nombre">${e.description}</p>
  //               <div>
  //                 <button><i id="${e.id}" class="fas fa-undo-alt change"></i></button>
  //                 <button><i id="${e.id}" class="far fa-trash-alt"></i></button>
  //               </div>
  //             </div>
  //           </li>`
  //         }
  //       })
  //     })
  //     .then(() => {
  //       const nodoChange = document.querySelectorAll('.change');

  //       nodoChange.forEach(e => {
  //         if(e.classList.contains("fa-undo-alt")){
  //           arrCompleted.push(e);
  //         } else {
  //           arrPending.push(e);
  //         }
  //       });
  //     })
  //     .catch(err => console.log(err))
  // };

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
        <li class="tarea change">
          <div class="not-done" id=${e.id}></div>
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
  
  const changeTask = (url, id, key) => {
    const payload = { completed: true };

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
        // getTasks(url)
        const auxPending = [];
        arrPending.forEach(e => {
          if(e.id !== parseInt(id)){
            auxPending.push(e)
          } else {
            arrCompleted.push(e)
            console.log(arrCompleted)
          }
        })

        arrPending = auxPending;
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
  }

  skeletonPending.addEventListener('click', e => {
    const idFocus = e.target.id;
    changeTask(urlBase, idFocus, sessionKey);
  });

  skeletonCompleted.addEventListener('click', e => {
    const idFocus = e.target.id;
    deleteTask(urlBase, idFocus, sessionKey);
    renderTasks(arrPending, arrCompleted);
  })

  nodoCloseSession.addEventListener('click', () => {
    sessionStorage.removeItem('key');
    location.href = '/index.html';
  });

  formAddTask.addEventListener('submit', e => {
    e.preventDefault();
    createTask(urlBase, newTask.value, sessionKey);
    formAddTask.reset();
  });

  getUser(urlBase);
  getTasks(urlBase);
});