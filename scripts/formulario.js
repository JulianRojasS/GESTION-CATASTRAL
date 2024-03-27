import { alerta } from "./funciones_generales.js";
$(document).ready(() => {
    const formulario = $('.formulario');
    formulario.on("submit", (e) => {
        e.preventDefault()
        const email = e.currentTarget[0].value
        const password = e.currentTarget[1].value
        const data = {
            email,
            password
        }
        $.ajax({
            url: "http://localhost:3000/login",
            type: "POST",
            datatype: "JSON",
            data: data,
            success: (res) => {
                if (res) {
                    $.ajax({
                        url: "http://localhost:3000/User/"+data.email,
                        type: "GET",
                        datatype: "JSON",
                        success: (res) => {
                            console.log(res)
                            sessionStorage.setItem("session", JSON.stringify(res))
                            window.location.href = "./views/index.html"
                        }
                    })
                } else {
                    alerta("Error", "Correo o contraseña incorrectos", "red")
                }
            }
        })
    })
})