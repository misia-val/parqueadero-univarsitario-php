fetch("../php/getEstudiante.php")
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            document.body.innerHTML = "<h2>No autenticado</h2>";
            return;
        }
        document.getElementById("nombre").innerText = data.nombre;
        document.getElementById("horaIngreso").innerText = data.entry_date;
        document.getElementById("horaSalida").innerText = data.exit_date;
        document.getElementById("placa").innerText = "VTU12F";
        document.getElementById("tipoVehiculo").innerText = data.vehicle;
        document.getElementById("Computador").innerText = "si";
    })
    .catch(err => console.error("Error al cargar estudiante:", err));