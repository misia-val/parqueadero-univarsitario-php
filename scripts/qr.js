fetch("../php/qr.php?id=1")
    .then(res => res.json())
    .then(data => {
        document.getElementById("parking_number").innerText = data.parking_number;
        document.getElementById("code_reserva").innerText = 'COD' + data.id_reserva;
        document.getElementById("exit_date").innerText = data.exit_date;
        const qr = document.querySelector('#imgqr');
        const enlaceQR = `https://tu-dominio.com/pages/qrGestor.html?id_reserva=${data.id_reserva}`;
        qr.src = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(enlaceQR)}&size=200x200`;


        // 👇 Inicia el contador solo cuando tenemos exit_date
        iniciarContador(data.exit_date);
    })
    .catch(err => console.error("Error al cargar estudiante:", err));

function iniciarContador(exitDate) {
    const horaSalida = new Date(exitDate).getTime();

    const intervalo = setInterval(() => {
        const ahora = new Date().getTime();
        const diferencia = horaSalida - ahora;

        if (diferencia <= 0) {
            clearInterval(intervalo);
            document.querySelector(".countdown").innerHTML = "⏰ Tiempo finalizado";
            return;
        }

        const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

        document.getElementById("horas").innerText = String(horas).padStart(2, '0');
        document.getElementById("minutos").innerText = String(minutos).padStart(2, '0');
        document.getElementById("segundos").innerText = String(segundos).padStart(2, '0');
    }, 1000);
}


// Llamamos a getEstudiante.php y pintamos los datos
fetch("../php/getEstudiante.php?id=1")
    .then(res => res.json())
    .then(data => {
        document.getElementById("nombre").innerText = data.nombre;
        document.getElementById("documento").innerText = data.documento;
    })
    .catch(err => console.error("Error al cargar estudiante:", err));

