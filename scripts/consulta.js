$(document).ready(()=> {
    $("#table").on("change", (e) => {
        const column = $("#column")[0]
        column.innerHTML = ""
        if (e.target.value == "ric_predio") {
            const options = ["Selecione una opción", "Numero Predial", "Numero Predial Anterior", "Folio Matricula Inmobiliaria", "Codigo Homologado"]
            options.forEach((e) => {
                var option = document.createElement("option")
                option.text = e
                option.value = `${e.toLowerCase().replaceAll(" ", "_").replace("folio_", "")}`
                column.appendChild(option)
            })
        } else if (e.target.value == "ric_interesado") {
            const options = ["Selecione una opción", "Numero de documento", "Nombre Completo"]
            const values = ["", "documento_identidad", "nombre"]
            options.forEach((e) => {
                var option = document.createElement("option")
                option.text = e
                option.value = values[options.indexOf(e)]
                column.appendChild(option)
            })
        } else {
            var option = document.createElement("option")
            option.text = "Selecione una opción"
            option.value = ""
            column.appendChild(option)
        }
    })

    $("#send").on("click", (e) => {
        e.preventDefault()
        if (validateRequiredData(["table", "column", "value"])) {
            if ($("#table").val() == "ric_interesado") {
                $.ajax({
                    url: `http://localhost:3000/interesadosByLike/${$("#column").val()}/${$("#value").val()}`,
                    type: "POST",
                    datatype: "JSON",
                    success: (res) => {
                        if (document.body.childNodes.length <=  16) {
                            const results = document.createElement("u")
                            results.innerHTML = "Se encontraron " + res.length + " coincidencia(s)"
                            results.id = "resultados"
                            document.body.appendChild(results)
                            createTable(res)
                        } else {
                            document.body.removeChild(document.body.childNodes.item(17))
                            document.body.removeChild(document.body.childNodes.item(16))
                            const results = document.createElement("u")
                            results.innerHTML = "Se encontraron " + res.length + " coincidencia(s)"
                            results.id = "resultados"
                            document.body.appendChild(results)
                            createTable(res, $("#table").val())
                        }
                    }
                })
            }  else if ($("#table").val() == "ric_predio") {
                $.ajax({
                    url: `http://localhost:3000/prediosByLike/${$("#column").val()}/${$("#value").val()}`,
                    type: "POST",
                    datatype: "JSON",
                    success: (res) => {
                        if (document.body.childNodes.length <=  16) {
                            const results = document.createElement("u")
                            results.innerHTML = "Se encontraron " + res.length + " coincidencia(s)"
                            results.id = "resultados"
                            document.body.appendChild(results)
                            createTable(res)
                        } else {
                            document.body.removeChild(document.body.childNodes.item(17))
                            document.body.removeChild(document.body.childNodes.item(16))
                            const results = document.createElement("u")
                            results.innerHTML = "Se encontraron " + res.length + " coincidencia(s)"
                            results.id = "resultados"
                            document.body.appendChild(results)
                            createTable(res, $("#table").val())
                        }
                    }
                })
            }
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
        if (element.value != undefined) {
            if (element.value != null) {
                if (element.value != "") {
                    t++
                }
            }
        }
    }
    if (t == idList.length) {
        return true
    }
}

export default function createTable (res, type) {
    const table = document.createElement("table")
    const head = document.createElement("thead")
    if (type == "ric_predio") {
        const options = ["Codigo Homologado", "Numero Predial", "Numero Predial Anterior", "Matricula Inmobiliaria", "Ver" ]
        options.forEach((e) => {
            var th = document.createElement("th")
            th.innerHTML = e
            th.id = e.toLowerCase().replaceAll(" ", "_")
            head.appendChild(th)
        })
        if (res.length > 0) {
            const body = document.createElement("tbody")
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
                see.addEventListener("click", () => {
                    window.open("http://localhost:3000/predio/"+ e.t_id)
                })
                tr.appendChild(button)
                body.appendChild(tr)
            })
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
    } else if (type = "ric_interesado") {
        const options = ["Nombre o Razón Social", "Documento", "Ver"]
        options.forEach((e) => {
            var th = document.createElement("th")
            th.innerHTML = e
            th.id = e.toLowerCase().replaceAll(" ", "_")
            head.appendChild(th)
        })
        if (res.length > 0) {
            const body = document.createElement("tbody")
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
                see.addEventListener("click", (x) => {
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
                                        seeButton.addEventListener("click", () => {
                                            window.open("http://localhost:3000/predio/"+e.predio, "_blank");
                                        })
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
    }

    table.appendChild(head)
    document.body.appendChild(table)
}


