document.addEventListener("DOMContentLoaded", () => {
    const btnVerificar = document.getElementById("btnVerificar");
    const inputId = document.getElementById("id_reservas");
    const infoDiv = document.getElementById("infoEstudiante");
    const mensajeError = document.getElementById("mensajeError");

    // --- Función para consultar la reserva ---
    async function buscarReserva(id) {
        if (!id) return;

        try {
            const res = await fetch("../php/getReserva.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `id_reservas=${encodeURIComponent(id)}`
            });
            const data = await res.json();

            if (data.error) {
                mensajeError.textContent = "❌ Reserva no encontrada.";
                mensajeError.style.display = "block";
                infoDiv.style.display = "none";
                return;
            }

            // Mostrar datos
            document.getElementById("nombre").innerText = data.nombre || "N/A";
            document.getElementById("horaIngreso").innerText = data.entry_date || "N/A";
            document.getElementById("horaSalida").innerText = data.exit_date || "N/A";
            document.getElementById("placa").innerText = data.placa || "N/A";
            document.getElementById("tipoVehiculo").innerText = data.vehicle || "N/A";
            document.getElementById("computador").innerText = data.computador === "1" ? "Sí" : "No";

            mensajeError.style.display = "none";
            infoDiv.style.display = "block";
        } catch (err) {
            console.error("Error al cargar reserva:", err);
            mensajeError.textContent = "⚠️ Error al conectar con el servidor.";
            mensajeError.style.display = "block";
            infoDiv.style.display = "none";
        }
    }

    // --- Búsqueda manual ---
    btnVerificar.addEventListener("click", (e) => {
        e.preventDefault();
        buscarReserva(inputId.value.trim());
    });

    // --- Leer parámetro de la URL (si viene desde el QR) ---
    const params = new URLSearchParams(window.location.search);
    const idUrl = params.get("id_reserva");
    if (idUrl) {
        inputId.value = idUrl;
        buscarReserva(idUrl);
    }

    // --- Configurar lector de QR ---
    if (document.getElementById("reader")) {
        const qrScanner = new Html5Qrcode("reader");
        qrScanner.start(
            { facingMode: "environment" },
            {
                fps: 10,
                qrbox: 250
            },
            (decodedText) => {
                // Si el QR contiene un link con ?id_reserva=XX
                const match = decodedText.match(/id_reserva=(\d+)/);
                if (match) {
                    const id = match[1];
                    inputId.value = id;
                    buscarReserva(id);
                    qrScanner.stop(); // Detiene la cámara después de leer
                } else {
                    mensajeError.textContent = "El QR no contiene un ID válido.";
                    mensajeError.style.display = "block";
                }
            },
            (errorMsg) => {
                // Opcional: mensajes de error del escáner
                console.warn("Error de escaneo:", errorMsg);
            }
        ).catch(err => {
            console.error("Error al iniciar cámara:", err);
        });
    }
});
