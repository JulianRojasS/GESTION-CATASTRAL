import { cerrarSesion } from "./unmodule.js"
$(document).ready(()=> {
    const sesion = JSON.parse(sessionStorage.getItem("session"))
    var input_nombre = $("#nombre").val(sesion.nombre)
    var input_email = $("#email").val(sesion.email)
    var input_rol = $("#rol").val(sesion.rol)
    var input_contrasenia = $("#password").val(sesion.contrasenia)
    $("#actualizar-usuario")[0].style.display = "none"
    $("#cancelar-actualizacion")[0].style.display = "none"
    input_contrasenia[0].style.display = "none"
    $("#passwordConf")[0].style.display = "none"
    $("#actualizar").on("click", (e) => {
        input_nombre[0].removeAttribute("disabled")
        input_email[0].removeAttribute("disabled")
        $("#actualizar-usuario")[0].style.display = "block"
        $("#actualizar-usuario")[0].style.border = "1px solid green"
        $("#actualizar-usuario")[0].style.boxShadow = "1px 2px 1px 0px green"
        $("#cancelar-actualizacion")[0].style.display = "block"
        $("#cancelar-actualizacion")[0].style.border = "1px solid red"
        $("#cancelar-actualizacion")[0].style.boxShadow = "1px 2px 1px 0px red"
        $("#actualizar")[0].style.display = "none"
        $("#actualizar-contrasenia")[0].style.display = "none"
        $("#cerrar-sesion")[0].style.display = "none"
    })
    $("#actualizar-contrasenia").on("click", (e) => {
        $("#password")[0].style.display = "block"
        $("#passwordConf")[0].style.display = "block"
        $("#actualizar-usuario")[0].style.display = "block"
        $("#actualizar-usuario")[0].style.border = "1px solid green"
        $("#actualizar-usuario")[0].style.boxShadow = "1px 2px 1px 0px green"
        $("#cancelar-actualizacion")[0].style.display = "block"
        $("#cancelar-actualizacion")[0].style.border = "1px solid red"
        $("#cancelar-actualizacion")[0].style.boxShadow = "1px 2px 1px 0px red"
        input_rol[0].style.display = "none"
        input_nombre[0].style.display = "none"
        input_email[0].style.display = "none"
        $("#actualizar")[0].style.display = "none"
        $("#actualizar-contrasenia")[0].style.display = "none"
        $("#cerrar-sesion")[0].style.display = "none"
    })
    $("#actualizar-usuario").on("click", () => {
        const data = {
            id: sesion.id,
            nombre: input_nombre.val(),
            email: input_email.val(),
            contrasenia: "",
            rol: input_rol.val()
        }
        if ($("#passwordConf").val() != "" & $("#passwordConf").val() != null && $("#passwordConf").val() != undefined) {
            data.contrasenia = input_contrasenia.val()
        } else {
            data.contrasenia = sesion.contrasenia
        }
        console.log(data)
        $.ajax({
            url: "http://localhost:3000/actualizarUsuario/" + data.id,
            type: "PUT",
            data: data,
            success: (res) => {
                if (res) {
                    cerrarSesion()
                }
            }
        })
    })
    $("#cancelar-actualizacion").on("click", () => {
        window.location.reload()
    })
    $("#cerrar-sesion").on("click", () => {
        cerrarSesion()
    })
})
