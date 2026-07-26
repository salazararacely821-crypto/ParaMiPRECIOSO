let paginaActual = 0;
const paginas = document.querySelectorAll('.pagina');
const totalPaginas = paginas.length;

function inicializarPaginas() {
    paginas.forEach((pagina, index) => {
        pagina.style.zIndex = totalPaginas - index;
        pagina.classList.remove('pasada');
    });

    comprobarRespuestaGuardada();
}

function siguientePagina() {
    if (paginaActual < totalPaginas - 1) {
        paginas[paginaActual].classList.add('pasada');
        paginaActual++;
    }
}

function paginaAnterior() {
    if (paginaActual > 0) {
        paginaActual--;
        paginas[paginaActual].classList.remove('pasada');
    }
}

paginas.forEach((pagina, index) => {
    pagina.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.classList.contains('btn-play')) {
            return;
        }
        if (index === paginaActual) {
            siguientePagina();
        }
    });
});

/* REPRODUCTOR DE MÚSICA */
const audio = document.getElementById('audio');
const playBtn = document.getElementById('play-btn');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');

if (playBtn && audio) {
    playBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playBtn.textContent = '❚❚';
        } else {
            audio.pause();
            playBtn.textContent = '▶';
        }
    });

    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            const porcentaje = (audio.currentTime / audio.duration) * 100;
            progress.value = porcentaje;

            let mins = Math.floor(audio.currentTime / 60);
            let secs = Math.floor(audio.currentTime % 60);
            if (secs < 10) secs = '0' + secs;
            currentTimeEl.textContent = `${mins}:${secs}`;
        }
    });

    progress.addEventListener('input', () => {
        if (audio.duration) {
            const nuevoTiempo = (progress.value / 100) * audio.duration;
            audio.currentTime = nuevoTiempo;
        }
    });
}

/* ==========================================
   ENVÍO DE RESPUESTA AL CORREO (WEB3FORMS)
   ========================================== */

const WEB3FORMS_KEY = '18d253f7-f7f8-4d16-93be-cc146827d5c4'; 

function enviarRespuestaAlCorreo(respuestaTexto) {
    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: "¡Nueva respuesta en tu libro interactivo! ❤️",
            from_name: "Libro de Propuesta",
            message: `Respuesta recibida: ${respuestaTexto}`
        })
    })
    .then(response => console.log("Notificación enviada al correo."))
    .catch(error => console.error("Error al enviar la notificación:", error));
}

function responderSi() {
    localStorage.setItem('respuestaPropuesta', 'si');
    mostrarMensajeExito();
    enviarRespuestaAlCorreo("¡Dijo que SÍ! 🥰❤️");
}

function responderNo() {
    localStorage.setItem('respuestaPropuesta', 'no');
    mostrarMensajeNo();
    enviarRespuestaAlCorreo("Dijo que NO... 🥺💔");
}

function mostrarMensajeExito() {
    const secPregunta = document.getElementById('seccion-pregunta');
    const secMensaje = document.getElementById('seccion-mensaje');
    const secMensajeNo = document.getElementById('seccion-mensaje-no');

    if (secPregunta) secPregunta.style.display = 'none';
    if (secMensajeNo) secMensajeNo.style.display = 'none';
    if (secMensaje) secMensaje.style.display = 'block';
}

function mostrarMensajeNo() {
    const secPregunta = document.getElementById('seccion-pregunta');
    const secMensaje = document.getElementById('seccion-mensaje');
    const secMensajeNo = document.getElementById('seccion-mensaje-no');

    if (secPregunta) secPregunta.style.display = 'none';
    if (secMensaje) secMensaje.style.display = 'none';
    if (secMensajeNo) secMensajeNo.style.display = 'block';
}

function comprobarRespuestaGuardada() {
    const respuesta = localStorage.getItem('respuestaPropuesta');
    if (respuesta === 'si') {
        mostrarMensajeExito();
    } else if (respuesta === 'no') {
        mostrarMensajeNo();
    }
}

inicializarPaginas();
