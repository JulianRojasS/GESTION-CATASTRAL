import { alerta, verificarSesion } from "./funciones_generales.js"

$(document).ready(()=> {
    verificarSesion()
    console.log(document.body.childNodes.length)
    $("#traveltable")[0].style.display = "none"
    $("#table").on("change", (e) => {
        const column = $("#column")[0]
        var options = []
        var values = []
        column.innerHTML = ""
        if (e.target.value == "ric_predio") {
            options = ["Seleccione una opción", "Numero Predial", "Numero Predial Anterior", "Folio Matricula Inmobiliaria", "Codigo Homologado"]
            values = ["", "numero_predial", "numero_predial_anterior", "folio_matricula_inmobiliaria", "codigo_homologado"]
        } else if (e.target.value == "ric_interesado") {
            options = ["Seleccione una opción", "Numero de documento", "Nombre Completo"]
            values = ["", "documento_identidad", "nombre"]
        } else {
            options = ["Seleccione una opción"]
            values = [""]
        }
        options.forEach((e) => {
            var option = document.createElement("option")
            option.text = e
            option.value = values[options.indexOf(e)]
            column.appendChild(option)
        })
    })
    $("#send").on("click", (e) => {
        e.preventDefault()
        if (validateRequiredData(["table", "column", "value"])) {
            $.ajax({
                url: `http://localhost:3000/${$("#table").val().replace("ric_", "")}sByLike/${$("#column").val()}/${$("#value").val()}`,
                type: "POST",
                datatype: "JSON",
                success: (res) => {
                    const results = document.createElement("u")
                    results.innerHTML = "Se encontraron " + res.length + " coincidencia(s)"
                    results.id = "resultados"
                    document.body.appendChild(results)
                    if (document.body.childNodes.length >=  22) {
                        document.body.removeChild(document.body.childNodes.item(21))
                        document.body.removeChild(document.body.childNodes.item(20))
                    }
                    createTable(res, $("#table").val(), "http://localhost:3000/predio/")
                }
            })
        } else {
            alerta("Error!", "Debes completar todos los campos", "orange")
        }
    }) 

    $("#bg-modal").on("click", () => {
        $("#modal")[0].style.display = "none"
        document.body.style.overflow = "auto"
    }) 
})


function validateRequiredData (idList) {
    var t = 0
    for(let i = 0; i < idList.length; i++){
        var element = document.getElementById(idList[i])
        if (element.value != undefined && element.value != null && element.value != "") t++
    }
    if (t == idList.length) return true
}

export default function createTable (res, type, predio) {
    const table = document.createElement("table")
    table.className = "tablas-consultas"
    const head = document.createElement("thead")
    const body = document.createElement("tbody")
    var i = 0
    var limit = 20
    document.getElementById("back").addEventListener("click", () => {
        if (type == "ric_predio") {
            if (limit >= 30) {
                limit = limit - 20
                i = limit - 20
                i = createBodyPredio(res, table, head, body, i, limit, predio)
            }
        } else if (type == "ric_interesado") {
            if (limit >= 30) {
                limit = limit - 20
                i = limit - 20
                i = createBodyInteresado(res, table, head, body, i, limit, predio)
            }
        }
    })
    document.getElementById("advance").addEventListener("click", () => {
        if (type == "ric_predio") {
            if (i < res.length - i) {
                limit = limit + 20
                i = createBodyPredio(res, table, head, body, i, limit, predio)
            } else if (i >= res.length - i && res.length - i > 0) {
                limit = res.length
                i = createBodyPredio(res, table, head, body, i, limit, predio)
            }
        } else if (type == "ric_interesado") {
            if (i < res.length - i) {
                limit = limit + 20
                i = createBodyInteresado(res, table, head, body, i, limit, predio)
            } else if (i >= res.length - i && res.length - i > 0) {
                limit = res.length
                i = createBodyInteresado(res, table, head, body, i, limit, predio)
            }
        }
    })

    if (type == "ric_predio") {
        i = createBodyPredio(res, table, head, body, i, limit, predio)
    } else if (type = "ric_interesado") {
        i = createBodyInteresado(res, table, head, body, i, limit, predio)
    }

    table.appendChild(head)
    document.body.appendChild(table)
}


function createBodyPredio (res, table, head, body,  i , limit, predio) {
    head.innerHTML = ""
    body.innerHTML = ""
    const options = ["Codigo Homologado", "Numero Predial", "Numero Predial Anterior", "Matricula Inmobiliaria", "Ver" ]
        options.forEach((e) => {
            var th = document.createElement("th")
            th.innerHTML = e
            th.id = e.toLowerCase().replaceAll(" ", "_")
            head.appendChild(th)
        })
        if (res.length > 0) {
            if (res.length > 20) {
                document.getElementById("traveltable").style.display = "block"
                while (i < limit) {
                    const tr = document.createElement("tr")
                    const codigo_homologado = document.createElement("td")
                    codigo_homologado.innerHTML = res[i].codigo_homologado
                    tr.appendChild(codigo_homologado)
                    const numero_predial = document.createElement("td")
                    numero_predial.innerHTML = res[i].numero_predial
                    tr.appendChild(numero_predial)
                    const numero_predial_anterior = document.createElement("td")
                    numero_predial_anterior.innerHTML = res[i].numero_predial_anterior
                    tr.appendChild(numero_predial_anterior)
                    const matricula_inmobiliaria = document.createElement("td")
                    matricula_inmobiliaria.innerHTML = res[i].matricula_inmobiliaria
                    tr.appendChild(matricula_inmobiliaria)
                    const button = document.createElement("td")
                    const see = document.createElement("button")
                    see.innerHTML = "Ver mas"
                    button.appendChild(see)
                    see.addEventListener("click", () => window.open(predio+ res[i].t_id))
                    tr.appendChild(button)
                    body.appendChild(tr)
                    i++
                }
            } else {
                document.getElementById("traveltable").style.display = "none"
                res.forEach((e) => {
                    const tr = document.createElement("tr")
                    const codigo_homologado = document.createElement("td")
                    codigo_homologado.innerHTML = e.codigo_homologado
                    tr.appendChild(codigo_homologado)
                    const numero_predial = document.createElement("td")
                    numero_predial.innerHTML = e.numero_predial
                    tr.appendChild(numero_predial)
                    const numero_predial_anterior = document.createElement("td")
                    numero_predial_anterior.innerHTML = e.numero_predial_anterior
                    tr.appendChild(numero_predial_anterior)
                    const matricula_inmobiliaria = document.createElement("td")
                    matricula_inmobiliaria.innerHTML = e.matricula_inmobiliaria
                    tr.appendChild(matricula_inmobiliaria)
                    const button = document.createElement("td")
                    const see = document.createElement("button")
                    see.innerHTML = "Ver mas"
                    button.appendChild(see)
                    see.addEventListener("click", () => window.open(predio+ e.t_id))
                    tr.appendChild(button)
                    body.appendChild(tr)
                })
            }
            table.appendChild(body)
        } else {
            const body = document.createElement("tbody")
            const tr = document.createElement("tr")
            const td = document.createElement("td")
            td.innerText = "No se encontraron resultados"
            td.colSpan = 5
            tr.appendChild(td)
            body.appendChild(tr)
            table.appendChild(body)
        }
    return i
}

function createBodyInteresado (res, table, head, body,  i , limit, predio) {
    head.innerHTML = ""
    body.innerHTML = ""
    const options = ["Nombre o Razón Social", "Documento", "Ver"]
    options.forEach((e) => {
        var th = document.createElement("th")
        th.innerHTML = e
        th.id = e.toLowerCase().replaceAll(" ", "_")
        head.appendChild(th)
    })
    if (res.length > 0) {
        if (res.length > 20) {
            document.getElementById("traveltable").style.display = "block"
            while (i < limit) {
                const tr = document.createElement("tr")
                const nombre = document.createElement("td")
                nombre.innerHTML = res[i].nombre
                tr.appendChild(nombre)
                const documento = document.createElement("td")
                documento.innerHTML = res[i].documento_identidad
                tr.appendChild(documento)
                const button = document.createElement("td")
                const see = document.createElement("button")
                see.innerHTML = "Ver mas"
                button.appendChild(see)
                see.addEventListener("click", () => {
                    const modal = document.getElementById("modal-body")
                    modal.innerHTML = ""
                    document.getElementById("modal").style.display = "block"
                    document.body.style.overflow = "hidden"
                    $.ajax({
                        url: `http://localhost:3000/ric_interesado/${res[i].t_id}`,
                        type: "POST",
                        datatype: "JSON",
                        success: (interesado) => {
                            const nombre = document.createElement("h2")
                            nombre.innerText = `Nombre: ${interesado.nombre}`
                            modal.appendChild(nombre)
                            const tipodocumento = document.createElement("p")
                            tipodocumento.innerText = `Tipo de documento: ${interesado.ric_interesadodocumentotipo.dispname}`
                            modal.appendChild(tipodocumento)
                            const dociden = document.createElement ("p")
                            dociden.innerText = `Número de documento: ${interesado.documento_identidad}`
                            modal.appendChild(dociden)
                            const close_modal_button = document.createElement("button")
                            close_modal_button.id = "close-modal"
                            close_modal_button.innerText = "x"
                            close_modal_button.addEventListener("click", () => {
                                document.getElementById("modal").style.display = "none"
                                document.body.style.overflow = "auto"
                            })
                            modal.appendChild(close_modal_button)
                            const scroll_table_modal = document.createElement("div")
                            scroll_table_modal.className = "scrool-table-modal"
                            const modal_table = document.createElement("table")
                            modal_table.className = "tablas-consultas"
                            const modal_thead = document.createElement("thead")
                            modal_table.appendChild(modal_thead)
                            const ths = ["Codigo Homologado", "Numero Predial", "Numero predial Anterior", "Matricula inmobiliaria", "Ver"]
                            ths.forEach((e) => {
                                const th = document.createElement("th")
                                th.innerHTML = e
                                modal_thead.appendChild(th)
                            })
                            const modal_tbody = document.createElement("tbody")
                            $.ajax({
                                url: `http://localhost:3000/predioDetalleInteresado/${res[i].t_id}`,
                                type: "POST",
                                datatype: "JSON",
                                success: (tabledata) => {
                                    tabledata.forEach((e) => {
                                        const tr = document.createElement("tr")
                                        const ch = document.createElement("td")
                                        ch.innerHTML = e.codigo_homologado
                                        tr.appendChild(ch)
                                        const np = document.createElement("td")
                                        np.innerHTML = e.numero_predial
                                        tr.appendChild(np)
                                        const npa = document.createElement("td")
                                        npa.innerHTML = e.numero_predial_anterior
                                        tr.appendChild(npa)
                                        const mi = document.createElement("td")
                                        mi.innerHTML = e.matricula_inmobiliaria
                                        tr.appendChild(mi)
                                        const see = document.createElement("td")
                                        see.style.backgroundColor = "black"
                                        const seeButton = document.createElement("button")
                                        seeButton.addEventListener("click", () => window.open(predio+e.predio, "_blank"))
                                        seeButton.innerText = "Ver mas"
                                        seeButton.target = "_blank"
                                        see.appendChild(seeButton)
                                        tr.appendChild(see)
                                        modal_tbody.appendChild(tr)
                                    })
                                    modal_table.appendChild(modal_tbody)
                                    scroll_table_modal.appendChild(modal_table)
                                    modal.appendChild(scroll_table_modal)
                                }
                            })
                            
                        }
                    })
                })
                tr.appendChild(button)
                body.appendChild(tr)
                i++
            }
        } else {
            document.getElementById("traveltable").style.display = "none"
            res.forEach((e) => {
                const tr = document.createElement("tr")
                const nombre = document.createElement("td")
                nombre.innerHTML = e.nombre
                tr.appendChild(nombre)
                const documento = document.createElement("td")
                documento.innerHTML = e.documento_identidad
                tr.appendChild(documento)
                const button = document.createElement("td")
                const see = document.createElement("button")
                see.innerHTML = "Ver mas"
                button.appendChild(see)
                see.addEventListener("click", () => {
                    const modal = document.getElementById("modal-body")
                    modal.innerHTML = ""
                    document.getElementById("modal").style.display = "block"
                    document.body.style.overflow = "hidden"
                    $.ajax({
                        url: `http://localhost:3000/ric_interesado/${e.t_id}`,
                        type: "POST",
                        datatype: "JSON",
                        success: (res) => {
                            const nombre = document.createElement("h2")
                            nombre.innerText = `Nombre: ${res.nombre}`
                            modal.appendChild(nombre)
                            const tipodocumento = document.createElement("p")
                            tipodocumento.innerText = `Tipo de documento: ${res.ric_interesadodocumentotipo.dispname}`
                            modal.appendChild(tipodocumento)
                            const dociden = document.createElement ("p")
                            dociden.innerText = `Número de documento: ${res.documento_identidad}`
                            modal.appendChild(dociden)
                            const close_modal_button = document.createElement("button")
                            close_modal_button.id = "close-modal"
                            close_modal_button.innerText = "x"
                            close_modal_button.addEventListener("click", () => {
                                document.getElementById("modal").style.display = "none"
                                document.body.style.overflow = "auto"
                            })
                            modal.appendChild(close_modal_button)
                            const scroll_table_modal = document.createElement("div")
                            scroll_table_modal.className = "scrool-table-modal"
                            const modal_table = document.createElement("table")
                            modal_table.className = "tablas-consultas"
                            const modal_thead = document.createElement("thead")
                            modal_table.appendChild(modal_thead)
                            const ths = ["Codigo Homologado", "Numero Predial", "Numero predial Anterior", "Matricula inmobiliaria", "Ver"]
                            ths.forEach((e) => {
                                const th = document.createElement("th")
                                th.innerHTML = e
                                modal_thead.appendChild(th)
                            })
                            const modal_tbody = document.createElement("tbody")
                            $.ajax({
                                url: `http://localhost:3000/predioDetalleInteresado/${e.t_id}`,
                                type: "POST",
                                datatype: "JSON",
                                success: (tabledata) => {
                                    tabledata.forEach((e) => {
                                        const tr = document.createElement("tr")
                                        const ch = document.createElement("td")
                                        ch.innerHTML = e.codigo_homologado
                                        tr.appendChild(ch)
                                        const np = document.createElement("td")
                                        np.innerHTML = e.numero_predial
                                        tr.appendChild(np)
                                        const npa = document.createElement("td")
                                        npa.innerHTML = e.numero_predial_anterior
                                        tr.appendChild(npa)
                                        const mi = document.createElement("td")
                                        mi.innerHTML = e.matricula_inmobiliaria
                                        tr.appendChild(mi)
                                        const see = document.createElement("td")
                                        see.style.backgroundColor = "black"
                                        const seeButton = document.createElement("button")
                                        seeButton.addEventListener("click", () => window.open(predio+e.predio, "_blank"))
                                        seeButton.innerText = "Ver mas"
                                        seeButton.target = "_blank"
                                        see.appendChild(seeButton)
                                        tr.appendChild(see)
                                        modal_tbody.appendChild(tr)
                                    })
                                    modal_table.appendChild(modal_tbody)
                                    scroll_table_modal.appendChild(modal_table)
                                    modal.appendChild(scroll_table_modal)
                                }
                            })                            
                        }
                    })
                })
                tr.appendChild(button)
                body.appendChild(tr)
            })
        }
        table.appendChild(body)
    }  else {
        const body = document.createElement("tbody")
        const tr = document.createElement("tr")
        const td = document.createElement("td")
        td.innerText = "No se encontraron resultados"
        td.colSpan = 5
        tr.appendChild(td)
        body.appendChild(tr)
        table.appendChild(body)
    }
    return i
}