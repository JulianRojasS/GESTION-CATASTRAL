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

verificarSesion()