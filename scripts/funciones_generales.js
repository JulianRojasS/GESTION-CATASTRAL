function verificarSesion () {
    const session = JSON.parse(sessionStorage.getItem("session"))

    if(session == null || session == undefined) {
        window.location.href = "../login.html"
    }
}

export function cerrarSesion() {
    sessionStorage.removeItem("session")
    window.location.href = "../login.html"
}

export function generarRegistro (entidades, estado_antiguo, estado_nuevo, cambio, usuario) {
    $.ajax({
        url: "http://localhost:3000/entidades/"+ entidades,
        type: "GET",
        datatype: "JSON",
        success: (entidad) => {
            var data = {}
            if (estado_antiguo != null && estado_antiguo != undefined) {
                data ={
                    entidades: entidad,
                    estado_antiguo: estado_antiguo,
                    estado_nuevo: estado_nuevo,
                    cambio: cambio,
                    users: usuario
                }
            } else {
                data ={
                    entidades: entidad,
                    estado_nuevo: estado_nuevo,
                    cambio: cambio,
                    users: usuario
                }
            }
            $.ajax({
                url: "http://localhost:3000/sendHistory",
                type: "POST",
                data: JSON.stringify(data),
                contentType: "application/json"
            })
        }
    })
}

export function alerta (titulo, mensaje, color) {
    const msj = document.getElementById("msj")
    msj.childNodes[1].innerText = titulo
    msj.childNodes[3].innerText = mensaje
    msj.style.backgroundColor = color
    msj.style.animation = "moverElemento 1s forwards"
    const esconder = () => {
        const msj = document.getElementById("msj")
        msj.style.animation = "esconderElemento 1s forwards"
    }
    setTimeout(esconder, 2000)
}

verificarSesion()