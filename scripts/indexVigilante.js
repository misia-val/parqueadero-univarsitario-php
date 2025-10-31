fetch("../php/getVigilante.php")
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            document.body.innerHTML = "<h2>No autenticado</h2>";
            return;
        }
        document.getElementById("nombre").innerText = data.nombre;
        document.getElementById("documento").innerText = data.documento;
        document.getElementById("rol").innerText = data.rol;
        document.getElementById("turno").innerText = data.turno;
    })
    .catch(err => console.error("Error al cargar vigilante:", err));