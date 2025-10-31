// alert('vamoss')
//Previene que los datos se envien mediante un metodo GET en el formulario cuando se le da
//enter con el teclado en el input tipo texto
document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.querySelector('form');
    formulario.addEventListener('submit', function (e) {
        e.preventDefault();
    });
});

//----- vehiculos selectionable section
// let containerVehicle = document.querySelector('.containerOptions');
let arrowDown = document.querySelector('.arrowDown');
let vehicleOptions = document.querySelector('.modalOptionsVehicle')
let motoOption = document.querySelector('.motoOption');
let carOption = document.querySelector('.carOption');
// let dash = document.querySelector('.dash')
let chosenOptionVehicle = '';


const vehiculo = document.querySelector('#vehiculo')

vehiculo.addEventListener('change', () => {
    // console.log(vehiculo.value)
    if (vehiculo.value == 'moto') {
        // console.log('Seleccionaste Moto');
        chosenOptionVehicle = 'Moto';
        verifyTotalAvailability();
    } else if (vehiculo.value == 'carro') {
        // console.log('Seleccionaste carro');
        chosenOptionVehicle = 'Carro';
        verifyTotalAvailability();
    } else {
        // console.log('No hay que hacer nada - Default')
    }

    if (vehiculo.value != 'default') {
        const opcionDefault = vehiculo.querySelector('option[value="default"]');
        opcionDefault.disabled = true;
    }
})



//-----time section------
let entryOptions = document.querySelector('.entryTimeList');
let allEntryOptions = document.querySelectorAll('.entryTimeList li');
let exitOptions = document.querySelector('.exitTimeList');
let dashDot = document.querySelector('.dashDot');
let dashDot1 = document.querySelector('.dashDot1');
let chosenOptionEntryTime = '';
let chosenOptionExitTime = '';



// ------NUEVO para el input tipo time
const ingreso = document.querySelector('#ingreso');
const salida = document.querySelector('#salida');
ingreso.addEventListener('change', () => {
    // console.log(ingreso.value);
    chosenOptionEntryTime = ingreso.value;
    verifyTotalAvailability();
})
salida.addEventListener('change', () => {
    // console.log(salida.value);
    chosenOptionExitTime = salida.value;
    verifyTotalAvailability();
})

//----Observaciones y boton enviar
let observations = document.querySelector('#observations');
let sendButton = document.querySelector('.bookButton');
const additionalInfo = document.querySelector('.additionalInfo')
const codeNumber = document.querySelector('#codeNumber');
const parkingNumber = document.querySelector('#parkingNumber');
const placa = document.querySelector('#placa');
const labelPlaca = document.querySelector('#label-placa');
const labelObservations = document.querySelector('#label-observations');

//Verifica si los 3 campos estan vacios para que el boton 'Reserva' no haga nada
//y hace un fetch a verificar.php para insertar los datos en la bbdd
const form = document.querySelector('#formulario');

// sendButton.addEventListener('click', (e) => {
form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validar que la hora de salida sea al menos 15 minutos mayor que la de ingreso
    const horaIngreso = ingreso.value.split(':');
    const horaSalida = salida.value.split(':');
    if (horaIngreso.length < 2 || horaSalida.length < 2) {
        alert('Selecciona las horas correctamente.');
        return;
    }

    const minutosIngreso = parseInt(horaIngreso[0], 10) * 60 + parseInt(horaIngreso[1], 10);
    const minutosSalida = parseInt(horaSalida[0], 10) * 60 + parseInt(horaSalida[1], 10);

    if (minutosSalida - minutosIngreso < 15) {
        alert('La hora de salida debe ser al menos 15 minutos mayor que la hora de ingreso.');
        return;
    }

    const camposIncompletos = [placa.value, chosenOptionVehicle, chosenOptionEntryTime, chosenOptionExitTime]
        .some(valor => valor === '');

    if (camposIncompletos) {
        e.preventDefault();
        console.log('completa todo');
        return;
    }
    // Si todos los campos están completos, no hace nada

    //datos del formulario a enviar a la bbdd
    const datos = {
        placa: placa.value,
        vehiculo: chosenOptionVehicle,
        ingreso: chosenOptionEntryTime,
        salida: chosenOptionExitTime,
        observations: observations.value,
        estudiante: 1
        //eliminar los espacios de la hora
        // $ingreso = str_replace(' ', '', $ingreso);
        // $salida = str_replace(' ', '', $salida);
    };
    fetch('../php/reservas.php', {
        method: 'POST',
        body: JSON.stringify(datos)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            window.location.href = '../pages/qr.html';
            // additionalInfo.style.display = 'flex';
            // codeNumber.innerText = data['randomNumber'];
            // parkingNumber.innerText = data['parkingNumber'];

            // labelPlaca.style.display = 'none';
            // placa.style.display = 'none';
            // labelObservations.style.display = 'none';
            // observations.style.display = 'none';
            // sendButton.style.display = 'none';
        })
    // try {
    //     //envio al backend con fetch
    //     const respuesta = await fetch('verificar.php', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(datos)
    //     });

    //     const resultado = await respuesta.json();
    //     console.log(resultado)
    // } catch (error) {
    //     console.error('Error al enviar datos:', error);
    // }
});

//number parkinglots available section
let numberAvailabilityMoto = document.querySelector('.counterMoto');
let numberAvailabilityCar = document.querySelector('.counterCar');

//
let timeNextParking = document.querySelector('#nextParkingAvailableTime');
let numberNextParking = document.querySelector('.numberParkingAvailable');

//------boton volver-------
const backButton = document.querySelector('.comeBack')
const containerNoParking = document.querySelector('.containerNoParking');
const containerBooking = document.querySelector('.containerBooking');


backButton.addEventListener('click', () => {
    containerNoParking.style.display = 'none';
    containerBooking.style.display = 'block';
    // dash.value = '-----'
    // dashDot.value = '-- : --';
    // dashDot1.value = '-- : --';
    chosenOptionEntryTime = '';
    chosenOptionExitTime = '';
    // chosenOptionVehicle = '';
    ingreso.value = '';
    salida.value = '';
})

//------------ Funtions -----------
function isEmptyTime(param1, t) {
    if (param1 != '') {
        // console.log('la opción escogida no esta vacia')
        t.style.letterSpacing = '0px';
        // t.style.letterWeight = 'normal';
        t.style.width = '65px'
        t.style.fontSize = '20px'
        t.value = param1;
        // suu(param1);
    }
}

//
function cleanTime(text) {
    return text.replace(/\s+/g, ''); // '18 : 00' → '18:00'
}

function timeToMinutes(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
}

//Cuando se hace selecciona el tipo de vehiculo, los datos hora de entrada y salida se extrae de la bbdd el numero de cupos
//disponibles dependiendo de la hora y vehiculo que el estudiante escogio, y lo muestra en el front.

function verifyTotalAvailability() {
    // console.log(chosenOptionVehicle !== '' && chosenOptionEntryTime !== '' && chosenOptionExitTime !== '');
    if (chosenOptionVehicle !== '' && chosenOptionEntryTime !== '' && chosenOptionExitTime !== '') {
        fetch('../php/reservas.php', {
            method: 'POST',
            body: JSON.stringify({ type: chosenOptionVehicle, entryTime: chosenOptionEntryTime, exitTime: chosenOptionExitTime })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if (data['vehiculo'] == 'Moto') {
                    // console.log('Es Motooo')
                    numberAvailabilityCar.classList.remove('disponible');
                    numberAvailabilityCar.classList.remove('noDisponible');

                    numberAvailabilityMoto.innerText = data['cuposDisponibles1'] + ' disponibles';

                    if (parseInt(data['cuposDisponibles1']) <= 0) {
                        numberAvailabilityMoto.classList.add('noDisponible');
                        numberAvailabilityMoto.classList.remove('disponible')
                        console.log('va en rojo')
                    } else {
                        numberAvailabilityMoto.classList.add('disponible');
                        numberAvailabilityMoto.classList.remove('noDisponible');
                        console.log('va en verde')
                    }
                    numberAvailabilityCar.innerText = '---';


                } else {
                    // console.log('Es carrooooo')
                    numberAvailabilityMoto.classList.remove('disponible');
                    numberAvailabilityMoto.classList.remove('noDisponible');

                    numberAvailabilityCar.innerText = data['cuposDisponibles1'] + ' disponibles';

                    if (parseInt(data['cuposDisponibles1']) <= 0) {
                        numberAvailabilityCar.classList.add('noDisponible');
                        numberAvailabilityCar.classList.remove('disponible')
                    } else {
                        numberAvailabilityCar.classList.add('disponible');
                        numberAvailabilityCar.classList.remove('noDisponible');
                    }
                    numberAvailabilityMoto.innerText = '---'
                }

                if (parseInt(data['cuposDisponibles1']) <= 0) {
                    // console.log('Si es igual a 0');
                    containerNoParking.style.display = 'block';
                    containerBooking.style.display = 'none';
                    console.log('esta es')
                    infoNoParking();
                } else {
                    // console.log('No es igual a 0');
                    containerNoParking.style.display = 'none';
                    containerBooking.style.display = 'block';
                }
            })
    }
    else {
        console.log('Escoge las 3 opciones')
    }
}

function infoNoParking() {
    fetch('../php/reservas.php', {
        method: 'POST',
        body: JSON.stringify({ typee: chosenOptionVehicle, entryTimee: chosenOptionEntryTime, exitTimee: chosenOptionExitTime })
    })
        .then(response1 => response1.json())
        .then(data => {
            console.log(data)
            const fechaCompleta = data['horaCupos'];
            const fecha = new Date(fechaCompleta);
            const hora = fecha.getHours().toString().padStart(2, '0') + ':' + fecha.getMinutes().toString().padStart(2, '0');
            // console.log(hora); // '19:00'

            timeNextParking.innerText = hora;
            numberNextParking.innerText = data['cupos'];
    })
}

// sendButton.addEventListener

//Si no hay vehiculos disponibles, el sistema mostrara el mensaje que dice que no hay disponibilidad y
// tambien mostrara la proxima hora y el numero de cupos que estaran disponibles
// function verifyAvailability(type) {
//     if (type != undefined) {
//         // console.log(type);
//         fetch("verificar.php", {
//             method: 'POST',
//             // headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ type: type, cupos: '' })
//         })
//             .then(response => response.json())
//             .then(data => {
//                 // console.log(data)
//                 console.log('Respuesta del servidor: ', data['cuposDisponibles']);
//                 const containerNoParking = document.querySelector('.containerNoParking');
//                 const containerBooking = document.querySelector('.containerBooking');

//                 if (parseInt(data['cuposDisponibles']) == 0) {
//                     // console.log('Si es igual a 0');
//                     containerNoParking.style.display = 'block';
//                     containerBooking.style.display = 'none';
//                 } else {
//                     // console.log('No es igual a 0');
//                     containerNoParking.style.display = 'none';
//                     containerBooking.style.display = 'block';
//                 }
//             })
//             .catch(error => console.error('Hay un error: ', error))
//     }
// }


