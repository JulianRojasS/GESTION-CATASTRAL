$(document).ready(async () => {
    const tablebody = $("#tablebody")[0]
    var current_info = []

    async function set_current_info (url) {
        await $.ajax({
            url: url,
            type: "POST",
            datatype: "JSON",
            success: (res) => {
                current_info = res
            }
        })
    }

    await set_current_info("http://localhost:3000/control_cambioss")


    function show (info) {
        tablebody.innerHTML = ""
        info.forEach((cambio) => {
            const tr = document.createElement("tr")
            const id = document.createElement("td")
            id.innerText = cambio.id
            tr.appendChild(id)
            const descripcion = document.createElement("td")
            descripcion.innerText = cambio.cambio
            tr.appendChild(descripcion)
            const fecha = document.createElement("td")
            fecha.innerText = cambio.fecha
            tr.appendChild(fecha)
            const entidad = document.createElement("td")
            entidad.innerText = cambio.entidades.nombre
            tr.appendChild(entidad)
            const usuario = document.createElement("td")
            usuario.innerText = cambio.users.nombre
            tr.appendChild(usuario)
            const td_button = document.createElement("td")
            const button = document.createElement("button")
            button.innerText = "Ver más"
            td_button.appendChild(button)
            tr.appendChild(td_button)
            tablebody.appendChild(tr)
        })
    }
    $("#filtro")[0].style.display = "none"

    $("#all").on("click" , async () => {
        $("#filtro")[0].style.display = "none"
        await set_current_info("http://localhost:3000/control_cambioss")
        show(current_info)
    })
    $("#1").on("click", async () => {
        $("#filtro")[0].style.display = "block"
        filter(["Selecione una opción", "Numero de documento", "Nombre Completo"], ["", "documento_identidad", "nombre"])
        await set_current_info("http://localhost:3000/controlCambiosEntidad/"+1)
        show(current_info)
    })
    $("#2").on("click", async () => {
        $("#filtro")[0].style.display = "block"
        filter(["Seleccione una opción", "Id", "Fecha inicio de tenencia", "Fraccion del derecho"], ["", "t_id",  "fecha_inicio_tenencia", "fraccion_derecho"])
        await set_current_info("http://localhost:3000/controlCambiosEntidad/"+2)
        show(current_info)
    })
    $("#3").on("click", async () => {
        $("#filtro")[0].style.display = "block"
        filter(["Selecione una opción", "Ente emisor", "Oficina origen", "Ciudad origen"], ["", "ente_emisor", "oficina_origen", "ciudad_origen"])
        await set_current_info("http://localhost:3000/controlCambiosEntidad/"+3)
        show(current_info)
    })
    
    show(current_info)

    function filter (options, values) {
        const select = $("#options-filter")[0]
        select.innerHTML = ""
        var value = 0
        options.forEach((o) => {
            const option = document.createElement("option")
            option.value = values[value]
            option.text = o
            select.appendChild(option)
            value++
        })
    
        const search_type = select
        const search_value = $("#value")[0]
        const search_button = $("#search")
        search_button.on("click", () => {
            const show_filter_info = []
            for (let cambio = 0; cambio < current_info.length; cambio++) {
                var current_object = JSON.parse(current_info[cambio].estado_nuevo)
                if (current_object[search_type.value] == search_value.value.toUpperCase()) {
                    show_filter_info.push(current_info[cambio])
                }
            }
            show(show_filter_info)
        })
    }
})
