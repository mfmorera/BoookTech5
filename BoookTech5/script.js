document.addEventListener("DOMContentLoaded", () => {
  const listaLibros = document.getElementById("lista-disponibles");
  const listaGuardados = document.getElementById("lista-guardados");

  const listaBtn = document.querySelector("#acciones button:nth-of-type(2)");
  const seleccionarBtn = document.querySelector("#acciones button:nth-of-type(3)");
  const eliminarBtn = document.querySelector("#acciones button:nth-of-type(4)");
  const guardarBtn = document.getElementById("btn-guardar");

  const buscarForm = document.querySelector(".acciones-busqueda");
  let libroSeleccionado = null;

  // Cargar libros disponibles desde API Spring Boot
  async function cargarLibros(filtro = "") {
    try {
      const endpoint = filtro ? `/api/libros?q=${encodeURIComponent(filtro)}` : `/api/libros`;
      const res = await fetch(endpoint);
      const libros = await res.json();

      listaLibros.innerHTML = "";

      libros.forEach(libro => {
        const li = document.createElement("li");
        li.textContent = libro.titulo;
        li.dataset.id = libro.id; // Suponiendo que se llama `id` en Spring
        listaLibros.appendChild(li);
      });
    } catch (error) {
      console.error("Error al cargar libros:", error);
    }
  }

  // Cargar libros guardados desde API Spring Boot
  async function cargarLibrosGuardados() {
    try {
      const res = await fetch("/api/libros/guardados");
      const guardados = await res.json();

      listaGuardados.innerHTML = "";

      guardados.forEach(libro => {
        const li = document.createElement("li");
        li.textContent = libro.titulo;
        listaGuardados.appendChild(li);
      });
    } catch (error) {
      console.error("Error al cargar libros guardados:", error);
    }
  }

  // Mostrar/ocultar lista de libros disponibles
  listaBtn.addEventListener("click", () => {
    const lista = document.querySelector(".lista-libros");
    lista.style.display = lista.style.display === "none" ? "block" : "none";
    cargarLibros(); // Cargar todos los libros
  });

  // Buscar libros
  buscarForm.addEventListener("submit", e => {
    e.preventDefault();
    const query = buscarForm.querySelector("input").value;
    cargarLibros(query);
  });

  // Seleccionar libro de la lista
  listaLibros.addEventListener("click", e => {
    if (e.target.tagName === "LI") {
      listaLibros.querySelectorAll("li").forEach(li => li.classList.remove("seleccionado"));
      e.target.classList.add("seleccionado");
      libroSeleccionado = {
        id: parseInt(e.target.dataset.id),
        titulo: e.target.textContent
      };
    }
  });

  // Guardar libro en base de datos (Spring Boot)
  guardarBtn.addEventListener("click", () => {
    if (!libroSeleccionado) {
      alert("Selecciona un libro primero");
      return;
    }

    fetch("/api/libros", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(libroSeleccionado)
    })
      .then(res => res.json())
      .then(data => {
        alert("Libro guardado correctamente");
        libroSeleccionado = null;
        cargarLibrosGuardados(); // Actualizar lista guardada
      })
      .catch(err => {
        console.error("Error al guardar:", err);
        alert("Hubo un error al guardar");
      });
  });

  // Cargar libros guardados al inicio
  cargarLibrosGuardados();
});
