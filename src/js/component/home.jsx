import React, { useEffect, useState } from "react";
import Footer from "./footer";

//include images into your bundle
import rigoImage from "../../img/rigo-baby.jpg";

//create your first component
const home = () => {
  const [newTask, setNewTask] = useState({ label: "", done: false });
  const [todo, setTodo] = useState([]);
  const [pending, setPending] = useState(true);
  const [userReady, setUserReady] = useState();

  let API_URL = "https://playground.4geeks.com/apis/fake/todos/user/deimian1";

  const getTask = async () => {
    try {
      let response = await fetch(API_URL);

      if (response.ok) {
        // userCreation();
        setUserReady(true);
        console.log("Ha sido creado exitosamente getTask");
        const body = await response.json();
        setPending(false);
        setTodo(body);
      } else {
        setUserReady(false);
        setPending(true);
        console.log("Oh-oh la solicitud getTask fallo");
      }
    } catch (error) {
      console.error(error);
    }
  };

  //createUser
  const userCreation = async () => {
    try {
      let response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([]),
      });
      if (response.ok) {
        setUserReady(true);
        console.log("El usuario ha sido creado exitosamente");
      }
    } catch (error) {
      console.error(error);
    }
  };

  //VariablesMapping
  const handleChange = (event) => {
    setNewTask({
      ...newTask,
      [event.target.name]: event.target.value,
    });
  };

  const addTask = (event) => {
    if (event.key == "Enter") {
      if (newTask.label.trim() != "") {
        updateTasks();
        setTodo([...todo, newTask]);
        setNewTask({ label: "", done: false });
        console.log("debo guardar la tarea");
      } else {
        console.log("no se aceptan cambios vacios");
      }
    }
  };

  //updateTasks
  const updateTasks = async () => {
    try {
      let body = [...todo, newTask];
      const response = await fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        await getTask();
        return response.json();
      } else {
        console.log("ocurrio algo malo");
      }
    } catch (error) {
      console.error(error);
    }
  };

  //deleteTasks
  const deleteTask = async (id) => {
    const newListTask = todo.filter((task, index) => id != index);
    try {
      let response = await fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newListTask),
      });
      if (response.ok) {
        setTodo(newListTask);
      }
    } catch (error) {}
  };

  //deleteAllTasks
  const deleteAll = async () => {
    try {
      const response = await fetch(API_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        await userCreation();
        await getTask();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTask();
  }, []);

  return (
    <div className="container">
      <div className="">
        <h1 className="text-center">ToDos</h1>
      </div>
      <div className="">
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            value={newTask.label}
            name={"label"}
            placeholder="Agregar tareas"
            onChange={handleChange}
            onKeyDown={addTask}
          />
        </div>
      </div>
      <div className="ms-2">
        <ul>
          {todo.map((task, index) => {
            return (
              <li key={index}>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  aria-label="Close"
                  onClick={() => deleteTask(index)}
                ></button>
                {task.label}
              </li>
            );
          })}
        </ul>

        {todo.length + " tareas"}

        <span className="container-fluid">
          <button
            type="button"
            className="btn btn-dark"
            onClick={() => {
              deleteAll();
            }}
          >
            Delete All
          </button>
        </span>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default home;
