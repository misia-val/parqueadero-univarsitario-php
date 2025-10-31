fetch("../php/getEstudiante.php")
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            document.body.innerHTML = "<h2>No autenticado</h2>";
            return;
        }
        document.getElementById("nombre").innerText = data.nombre;
        document.getElementById("documento").innerText = data.documento;
        document.getElementById("rol").innerText = data.rol;
        document.getElementById("carrera").innerText = data.carrera;
    })
    .catch(err => console.error("Error al cargar estudiante:", err));