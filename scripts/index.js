$(document).ready(()=> {
    console.log(document.body.childNodes.length)
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
                const value = $("#value").val()
                var url = `http://localhost:3000/interesadosByLike/${$("#column").val()}/${value}`
                console.log(url)
                $.ajax({
                    url: url,
                    type: "POST",
                    datatype: "JSON",
                    success: (res) => {
                        console.log(res)
                        if (document.body.childNodes.length <=  13) {
                            const results = document.createElement("p")
                            results.innerHTML = "Se encontraron " + res.length + " coincidencia(s)"
                            document.body.appendChild(results)
                            createTable(res)
                        } else {
                            document.body.removeChild(document.body.childNodes.item(14))
                            document.body.removeChild(document.body.childNodes.item(13))
                            const results = document.createElement("p")
                            results.innerHTML = "Se encontraron " + res.length + " coincidencia(s)"
                            document.body.appendChild(results)
                            createTable(res)
                        }
                    }
                })
            }  else if ($("#table").val() == "ric_predio") {
                const value = $("#value").val()
                var url = `http://localhost:3000/prediosByLike/${$("#column").val()}/${value}`
                console.log(url)
                $.ajax({
                    url: url,
                    type: "POST",
                    datatype: "JSON",
                    success: (res) => {
                        if (document.body.childNodes.length <=  13) {
                            const results = document.createElement("p")
                            results.innerHTML = "Se encontraron " + res.length + " coincidencia(s)"
                            document.body.appendChild(results)
                            createTable(res)
                        } else {
                            document.body.removeChild(document.body.childNodes.item(14))
                            document.body.removeChild(document.body.childNodes.item(13))
                            const results = document.createElement("p")
                            results.innerHTML = "Se encontraron " + res.length + " coincidencia(s)"
                            document.body.appendChild(results)
                            createTable(res)
                        }
                    }
                })
            }
        }
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

function createTable (res) {
    const table = document.createElement("table")
    const head = document.createElement("thead")
    if (document.getElementById("table").value == "ric_predio") {
        const options = ["Codigo Homologado", "Numero Predial", "Numero Predial Anterior", "Matricula Inmobiliaria", "Ver" ]
        options.forEach((e) => {
            var th = document.createElement("th")
            th.innerHTML = e
            th.id = e.toLowerCase().replaceAll(" ", "_")
            head.appendChild(th)
        })
        if (res != null) {
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
                const see = document.createElement("button")
                see.innerHTML = "Ver mas"
                tr.appendChild(see)
                body.appendChild(tr)
            })
            table.appendChild(body)
        }
    } else if (document.getElementById("table").value = "ric_interesado") {
        const options = ["Nombre o Razón Social", "Documento", "Ver"]
        options.forEach((e) => {
            var th = document.createElement("th")
            th.innerHTML = e
            th.id = e.toLowerCase().replaceAll(" ", "_")
            head.appendChild(th)
        })
        if (res != null) {
            const body = document.createElement("tbody")
            res.forEach((e) => {
                const tr = document.createElement("tr")
                const nombre = document.createElement("td")
                nombre.innerHTML = e.nombre
                tr.appendChild(nombre)
                const documento = document.createElement("td")
                documento.innerHTML = e.documento_identidad
                tr.appendChild(documento)
                const see = document.createElement("button")
                see.innerHTML = "Ver mas"
                see.addEventListener("click", (x) => {
                    const modal = document.getElementById("modal")
                    modal.innerHTML = ""
                    $.ajax({
                        url: `http://localhost:3000/interesadosByLike/nombre/${e.nombre}`,
                        type: "POST",
                        datatype: "JSON",
                        success: (res) => {
                            console.log(res[0])
                            const nombre = document.createElement("h2")
                            nombre.innerText = res[0].nombre
                            modal.appendChild(nombre)
                            const tipodocumento = document.createElement("p")
                            tipodocumento.innerText = res[0].tipo_documento
                            modal.appendChild(tipodocumento)
                            const dociden = document.createElement ("p")
                            dociden.innerText = res[0].documento_identidad
                            modal.appendChild(dociden)
                        }
                    })
                })
                tr.appendChild(see)
                body.appendChild(tr)
            })
            table.appendChild(body)
        }
    }

    table.appendChild(head)
    document.body.appendChild(table)
}


