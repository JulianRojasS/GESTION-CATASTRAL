$(document).ready(()=> {
    var interesadosnuevos = []
    var derecho = []
    var fuenteadministrativa = []
    $("#search_predio").on("submit", (e) => {
        e.preventDefault()
        const np = e.target[0].value
        if (np.length == 30) {
            $.ajax({
                url: "http://localhost:3000/prediosByLike/numero_predial/" + np,
                type: "POST",
                datatype: "JSON",
                success: (res) => {
                    if (typeof(res[0]) != "undefined") {
                        $.ajax({
                            url: "http://localhost:3000/interesadosPredio/" + res[0].t_id,
                            type: "POST",
                            datatype: "JSON",
                            success: (interesados) => {
                                interesados_actuales(interesados)
                                interesados_nuevos(interesadosnuevos)
                                derechonuevo(derecho)
                                fuenteadministrativanueva(fuenteadministrativa)
                                /// Enviar Respuesta
                                const send = document.createElement("button")
                                send.addEventListener("click", () => {
                                    if (interesadosnuevos.length > 0) {
                                        if (derecho.length > 0) {
                                            if (fuenteadministrativa.length > 0) {
                                                if (interesadosnuevos.length < 2) {
                                                    if (interesadosnuevos[0].existencia) {
                                                        derecho[0] = crearDerecho(interesadosnuevos[0].interesado, derecho[0], "unico")
                                                    } else {
                                                        const data = interesado_objeto_respuesta(interesadosnuevos[0].interesado)
                                                        $.ajax({
                                                            url: "http://localhost:3000/interesadoInsertar",
                                                            type: "POST",
                                                            data: data,
                                                            success: (newinteresado) => {
                                                                derecho[0] = crearDerecho(newinteresado, derecho[0], "unico")
                                                            },
                                                            datatype: "text"
                                                        })
                                                    }
                                                    $.ajax({
                                                        url: "http://localhost:3000/col_rrrfuenteByDerecho/"+derecho[0].t_id,
                                                        type: "GET",
                                                        datatype: "JSON",
                                                        success: (rrrs) => {
                                                            rrrs.forEach((rrr) => {
                                                                $.ajax({
                                                                    url: "http://localhost:3000/eliminarCol_rrrfuente/"+rrr.t_id,
                                                                    type: "DELETE",
                                                                })
                                                            })
                                                        }
                                                    })            
                                                    fuenteadministrativa.forEach((fuente) => {
                                                        fuente.local_id = res[0].numero_predial.slice(res[0].numero_predial.length-5)
                                                        $.ajax({
                                                            url: "http://localhost:3000/fuenteadministrativaInsertar",
                                                            type: "POST",
                                                            data: JSON.stringify(fuente),
                                                            contentType: "application/json",
                                                            success: (newfuente) => {
                                                                $.ajax({
                                                                    url: "http://localhost:3000/insertarCol_rrrfuente",
                                                                    type: "POST",
                                                                    data: JSON.stringify({
                                                                        t_id: "",
                                                                        ric_fuenteadministrativa: newfuente,
                                                                        ric_derecho: derecho[0]
                                                                    }),
                                                                    contentType: "application/json",
                                                                })
                                                                $.ajax({
                                                                    url: "http://localhost:3000/insertarCol_unidadfuente",
                                                                    type: "POST",
                                                                    data: JSON.stringify({
                                                                        t_id: "",
                                                                        ric_fuenteadministrativa: newfuente,
                                                                        ric_predio: res[0]
                                                                    }),
                                                                    success: (response) => {
                                                                        if (response.t_id != null) {
                                                                            alerta("Correcto!", "Los datos se actualizaron", "green")
                                                                        }
                                                                    },
                                                                    contentType: "application/json",
                                                                })
                                                            }
                                                        })
                                                    })                                            
                                                } else {
                                                    interesadosnuevos.forEach((i) => {
                                                        if (i.existencia) {
                                                        } else {
                                                            const data = interesado_objeto_respuesta(i.interesado)
                                                            $.ajax({
                                                                url: "http://localhost:3000/interesadoInsertar",
                                                                type: "POST",
                                                                data: data,
                                                                datatype: "text"
                                                            })
                                                        }
                                                        
                                                    })
                                                    if (derecho[0].ric_agrupacioninteresados != null) {
                                                        const agrupacion = derecho[0].ric_agrupacioninteresados
                                                        $.ajax({
                                                            url: "http://localhost:3000/eliminarCol_miembrosByAgrupacion/"+ agrupacion.t_id,
                                                            type: "DELETE",
                                                        })
                                                        interesadosnuevos.forEach((i) => {
                                                            $.ajax({
                                                                url: "http://localhost:3000/interesadoPorDocumento/"+i.interesado.documento_identidad,
                                                                type: "POST",
                                                                datatype: "JSON",
                                                                success: (response) => {
                                                                    $.ajax({
                                                                        url: "http://localhost:3000/insertarCol_miembros",
                                                                        type: "POST",
                                                                        data: JSON.stringify({
                                                                            t_id: "",
                                                                            ric_interesado: response,
                                                                            ric_agrupacioni: agrupacion,
                                                                            participacion: 1/interesadosnuevos.length
                                                                        }),
                                                                        contentType: "application/json",
                                                                        success: (response) => {
        
                                                                        }
                                                                    })
                                                                }
                                                            }) 
                                                        })
                                                        derecho[0] = crearDerecho(agrupacion, derecho[0], "agrupacion")
                                                    } else {
                                                        var natrual = 0
                                                        var grupoempresarial = 0
                                                        for (let interesadonuevo = 0; interesadonuevo < interesadosnuevos.length; interesadonuevo++){
                                                            const interesado = interesadosnuevos[interesadonuevo].interesado
                                                            if (interesado.ric_interesadodocumentotipo.dispname != "NIT") {
                                                                natrual++
                                                            } else {
                                                                grupoempresarial++
                                                            }
                                                        }
                                                        /* Crear Agrupacion */
                                                        var tipo = 0
                                                        if (natrual > 0 && grupoempresarial > 0) {
                                                            tipo = 307
                                                        } else if (natrual > 0 && grupoempresarial == 0) {
                                                            tipo = 304
                                                        } else if (natrual == 0 && grupoempresarial > 0) {
                                                            tipo = 305
                                                        }
        
                                                        $.ajax({
                                                            url: "http://localhost:3000/col_grupointeresadotipo/"+tipo,
                                                            type: "GET",
                                                            datatype: "JSON",
                                                            success: (tipo) => {
                                                                $.ajax({
                                                                    url: "http://localhost:3000/insertarRic_agrupacioninteresados",
                                                                    type: "POST",
                                                                    contentType: "application/json",
                                                                    data: JSON.stringify({
                                                                        t_id: "",
                                                                        t_ili_tid: "",
                                                                        col_grupointeresadotipo: tipo,
                                                                        nombre: "",
                                                                        comienzo_vida_util_version: new Date(),
                                                                        fin_vida_util_version: null,
                                                                        espacio_de_nombres: "RIC_AGRUPACIONINTERESADOS",
                                                                        local_id: res[0].numero_predial.slice(res[0].numero_predial.length-5)
                                                                    }),
                                                                    success: (agrupacion) => {
                                                                        /* Crear col_miebros interesados */
                                                                        interesadosnuevos.forEach((i) => {
                                                                            $.ajax({
                                                                                url: "http://localhost:3000/interesadoPorDocumento/"+i.interesado.documento_identidad,
                                                                                type: "POST",
                                                                                datatype: "JSON",
                                                                                success: (response) => {
                                                                                    $.ajax({
                                                                                        url: "http://localhost:3000/insertarCol_miembros",
                                                                                        type: "POST",
                                                                                        data: JSON.stringify({
                                                                                            t_id: "",
                                                                                            ric_interesado: response,
                                                                                            ric_agrupacioni: agrupacion,
                                                                                            participacion: 1/interesadosnuevos.length
                                                                                        }),
                                                                                        contentType: "application/json",
                                                                                        success: (response) => {
        
                                                                                        }
                                                                                    })
                                                                                }
                                                                            }) 
                                                                        })
                                                                        derecho[0] = crearDerecho(agrupacion, derecho[0], "agrupacion")
                                                                    }
                                                                })
                                                            }
                                                        })
                                                        $.ajax({
                                                            url: "http://localhost:3000/col_rrrfuenteByDerecho/"+derecho[0].t_id,
                                                            type: "GET",
                                                            datatype: "JSON",
                                                            success: (rrrs) => {
                                                                rrrs.forEach((rrr) => {
                                                                    $.ajax({
                                                                        url: "http://localhost:3000/eliminarCol_rrrfuente/"+rrr.t_id,
                                                                        type: "DELETE",
                                                                    })
                                                                })
                                                            }
                                                        })    
                                                        fuenteadministrativa.forEach((fuente) => {
                                                        $.ajax({
                                                            url: "http://localhost:3000/fuenteadministrativaInsertar",
                                                            type: "POST",
                                                            data: JSON.stringify(fuente),
                                                            contentType: "application/json",
                                                            success: (newfuente) => {
                                                                $.ajax({
                                                                    url: "http://localhost:3000/insertarCol_rrrfuente",
                                                                    type: "POST",
                                                                    data: JSON.stringify({
                                                                        t_id: "",
                                                                        ric_fuenteadministrativa: newfuente,
                                                                        ric_derecho: derecho[0]
                                                                    }),
                                                                    contentType: "application/json",
                                                                })
                                                                    $.ajax({
                                                                        url: "http://localhost:3000/insertarCol_unidadfuente",
                                                                        type: "POST",
                                                                        data: JSON.stringify({
                                                                            t_id: "",
                                                                            ric_fuenteadministrativa: newfuente,
                                                                            ric_predio: res[0]
                                                                        }),
                                                                        success: (response) => {
                                                                            if (response.t_id != null) {
                                                                                alerta("Correcto!", "Los datos se actualizaron", "green")
                                                                            }
                                                                        },
                                                                        contentType: "application/json",
                                                                    })
                                                                }
                                                            })
                                                        })                                          
                                                    }
                                                }
                                            } else {
                                                alerta("Error", "Aun no ha ingresado ninguna fuente administrativa", "red")
                                            }
                                        } else {
                                            alerta("Error", "Aun no ha ingresado nigun derecho", "red")
                                        }
                                    } else {
                                        alerta("Error", "Aun no ha ingresado ningun interesado", "red")
                                    }
                                })
                                send.innerText = "Guardar Cambios"
                                document.body.appendChild(send)
                            }
                        })
                    } else {
                        alerta("Error", "no se encontraron resultados", "red")
                    }
                    $.ajax({
                        url: "http://localhost:3000/derechosPredio/"+ res[0].t_id,
                        type: "GET",
                        datatype: "JSON",
                        success: (derechoactual) => {
                            derecho.push(derechoactual[0])                            
                        }
                    })    
                }
            })
        } else {
            alerta("Error en busqueda","Ingresa un numero predial correcto", "Orange")
        }
    })

})

function alerta (titulo, mensaje, color) {
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

function interesados_actuales (res) {
    const interesados_actuales_tittle = document.createElement("h2")
    interesados_actuales_tittle.innerText = "interesados actuales"
    document.getElementById("interesados-actual").appendChild(interesados_actuales_tittle)
    const table = document.createElement("table")
    const head = document.createElement("thead")
    const options = ["Tipo de documento", "Nombre o Razón Social", "Documento", "Participacion"]
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
                const documento_tipo = document.createElement("td")
                documento_tipo.innerText = e.dispname
                tr.appendChild(documento_tipo)
                const nombre = document.createElement("td")
                nombre.innerHTML = e.nombre
                tr.appendChild(nombre)
                const documento = document.createElement("td")
                documento.innerHTML = e.documento_identidad
                tr.appendChild(documento)
                const participacion = document.createElement("td")
                participacion.innerText = e.participacion
                tr.appendChild(participacion)
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
        table.appendChild(head)
        document.getElementById("interesados-actual").appendChild(table)
}

async function interesados_nuevos (interesadosnuevos) {
    const form = document.createElement("form")
    const interesados_nuevos_tittle = document.createElement("h2")
    interesados_nuevos_tittle.innerText = "Interesados nuevos"
    form.appendChild(interesados_nuevos_tittle)
    const table = document.createElement("table")
    const thead = document.createElement("thead")
    const tbody = document.createElement("tbody")
    form.addEventListener("submit", (e) => e.preventDefault())
    const options = ["Agregar", "Documento*", "Tipo*", "Tipo documento*", "Existencia", "Nombre", "Sexo" ,"Grupo Etnico", "Razon Social", "Estado Civil"]
    options.forEach((e) => {
        var th = document.createElement("th")
        th.innerHTML = e
        th.id = e.toLowerCase().replaceAll(" ", "_")
        thead.appendChild(th)
    })
    tbody.appendChild(await interesados_nuevos_validation(tbody, interesadosnuevos))
    table.appendChild(thead)
    table.appendChild(tbody)
    form.appendChild(table)
    document.getElementById("interesados-nuevo").appendChild(form)
}

async function interesados_nuevos_validation (body, interesadosnuevos) {
    const inputs_tr = document.createElement("tr")
    const button_add = document.createElement("button")
    button_add.innerText = "+"
    button_add.addEventListener("click", () => {
        if (validacion_inputs(inputs_tr)) {
            var isIn = false;
            for(let un = 0; un < interesadosnuevos.length ; un++) {
                if (interesadosnuevos[un].interesado.documento_identidad == input_Documento.value) {
                    isIn = true;
                }
            }
            if (!isIn) {
                const tr = document.createElement("tr")
                const td_void = document.createElement("td")
                tr.appendChild(td_void)
                const td_documento = document.createElement("td")
                td_documento.innerText = input_Documento.value
                tr.appendChild(td_documento)
                const td_tipo = document.createElement("td")
                td_tipo.innerText = input_Tipo[input_Tipo.selectedIndex].text
                tr.appendChild(td_tipo)
                const td_documento_tipo = document.createElement("td")
                td_documento_tipo.innerText = input_Tipo_documento[input_Tipo_documento.selectedIndex].text
                tr.appendChild(td_documento_tipo)
                const td_existencia = document.createElement("td")
                const existencia = document.createElement("input")
                existencia.type = "checkbox"
                existencia.disabled = true
                existencia.checked = input_Existencia.checked
                td_existencia.appendChild(existencia)
                const td_nombre = document.createElement("td")
                td_nombre.innerText = input_Nombre.value
                tr.appendChild(td_nombre)
                tr.appendChild(td_existencia) 
                const td_sexo = document.createElement("td")
                td_sexo.innerText = input_Sexo[input_Sexo.selectedIndex].text
                tr.appendChild(td_sexo)
                const td_grupo_etnico = document.createElement("td")
                td_grupo_etnico.innerText = input_Grupo_Etnico[input_Grupo_Etnico.selectedIndex].text
                tr.appendChild(td_grupo_etnico)
                const td_razon_social = document.createElement("td")
                td_razon_social.innerText = input_Razon_Social.value
                tr.appendChild(td_razon_social)
                const td_estado_civil = document.createElement("td")
                td_estado_civil.innerText = input_Estado_Civil[input_Estado_Civil.selectedIndex].text
                tr.appendChild(td_estado_civil)
                const documento_length = input_Documento.value.length
                if (existencia.checked) {
                    $.ajax({
                        url: "http://localhost:3000/interesadoPorDocumento/"+input_Documento.value,
                        type: "POST",
                        datatype: "JSON",
                        success: (res) => {
                            interesadosnuevos.push({
                                interesado: res,
                                existencia: input_Existencia.checked
                            })
                        }
                    }) 
                } else {
                    interesadosnuevos.push({
                        interesado: {
                            t_id: "",
                            t_ili_tid: "",
                            ric_interesadotipo: input_Tipo.value,
                            ric_interesadodocumentotipo: input_Tipo_documento.value,
                            documento_identidad: input_Documento.value,
                            primer_nombre: input_Nombre.value.split(" ")[0],
                            segundo_nombre: input_Nombre.value.split(" ")[1],
                            primer_apellido: input_Nombre.value.split(" ")[2],
                            segundo_apellido: input_Nombre.value.split(" ")[3],
                            ric_sexotipo: input_Sexo.value,
                            ric_grupoetnicotipo: input_Grupo_Etnico.value,
                            razon_social: input_Razon_Social.value,
                            ric_estadociviltipo: input_Estado_Civil.value,
                            nombre: input_Nombre.value,
                            espacio_de_nombres: "RIC_INTERESADO",
                            local_id: input_Documento.value.slice(documento_length-5)
                        },
                        existencia: input_Existencia.checked
                    })
                }
                body.appendChild(tr)
            } else {
                alerta("Error en interesados nuevos", "Ya ingresaste ese interesado", "orange")
            }
        } else {
            alerta("Error", "Debe completar todos los campos", "red")
        }
    })
    inputs_tr.appendChild(button_add)
    const input_Documento = document.createElement("input")
    input_Documento.required = true
    const td_input_Documento = document.createElement("td")
    td_input_Documento.appendChild(input_Documento)
    inputs_tr.appendChild(td_input_Documento)
    const input_Tipo = document.createElement("select")
    input_Tipo.required = true
    const input_Tipo_options = await options("ric_interesadotipo")
    input_Tipo_options.required = true
    input_Tipo_options.forEach((o) => {
        const option = document.createElement("option")
        option.value = o.t_id
        option.text = o.dispname
        input_Tipo.appendChild(option)
    })
    const td_input_Tipo = document.createElement("td")
    td_input_Tipo.appendChild(input_Tipo)
    inputs_tr.appendChild(td_input_Tipo)
    const input_Tipo_documento = document.createElement("select")
    input_Tipo_documento.required = true
    const input_Tipo_documento_options = await options("ric_interesadodocumentotipo")
    input_Tipo_documento_options.required = true
    input_Tipo_documento_options.forEach((o) => {
        const option = document.createElement("option")
        option.value = o.t_id
        option.text = o.dispname
        input_Tipo_documento.appendChild(option)
    })
    const td_input_Tipo_documento = document.createElement("td")
    td_input_Tipo_documento.appendChild(input_Tipo_documento)
    inputs_tr.appendChild(td_input_Tipo_documento)
    const input_Existencia = document.createElement("input")
    input_Existencia.required = true
    input_Existencia.type = "checkbox"
    const td_input_Existencia = document.createElement("td")
    input_Existencia.disabled = true
    td_input_Existencia.appendChild(input_Existencia)
    inputs_tr.appendChild(td_input_Existencia)
    const input_Nombre = document.createElement("input")
    input_Nombre.required = true
    const td_input_Nombre = document.createElement("td")
    td_input_Nombre.appendChild(input_Nombre)
    inputs_tr.appendChild(td_input_Nombre)
    const input_Sexo = document.createElement("select")
    input_Sexo.required = true
    const input_Sexo_options = await options("ric_sexotipo")
    input_Sexo_options.required = true
    input_Sexo_options.forEach((o) => {
        const option = document.createElement("option")
        option.value = o.t_id
        option.text = o.dispname
        input_Sexo.appendChild(option)
    })
    const td_input_Sexo = document.createElement("td")
    td_input_Sexo.appendChild(input_Sexo)
    inputs_tr.appendChild(td_input_Sexo)
    const input_Grupo_Etnico = document.createElement("select")
    input_Grupo_Etnico.required = true
    const input_Grupo_Etnico_options = await options("ric_grupoetnicotipo")
    input_Grupo_Etnico_options.required = true
    input_Grupo_Etnico_options.forEach((o) => {
        const option = document.createElement("option")
        option.value = o.t_id
        option.text = o.dispname
        input_Grupo_Etnico.appendChild(option)
    })
    const td_input_Grupo_Etnico = document.createElement("td")
    td_input_Grupo_Etnico.appendChild(input_Grupo_Etnico)
    inputs_tr.appendChild(td_input_Grupo_Etnico)
    const input_Razon_Social = document.createElement("input")
    const td_input_Razon_Social = document.createElement("td")
    td_input_Razon_Social.className = "noval"
    td_input_Razon_Social.appendChild(input_Razon_Social)
    inputs_tr.appendChild(td_input_Razon_Social)
    const input_Estado_Civil = document.createElement("select")
    input_Estado_Civil.required = true
    const input_Estado_Civil_options = await options("ric_estadociviltipo")
    input_Estado_Civil_options.required = true
    input_Estado_Civil_options.forEach((o) => {
        const option = document.createElement("option")
        option.value = o.t_id
        option.text = o.dispname
        input_Estado_Civil.appendChild(option)
    })
    const td_input_Estado_Civil = document.createElement("td")
    td_input_Estado_Civil.appendChild(input_Estado_Civil)
    inputs_tr.appendChild(td_input_Estado_Civil)
    input_Documento.addEventListener("blur" , () => {
            if (input_Documento.value.length > 0) {
                $.ajax({
                    url: "http://localhost:3000/interesadoPorDocumento/"+input_Documento.value,
                    type: "POST",
                    datatype: "JSON",
                    success: (res) => {
                        if(res.t_id != null) {
                            input_Existencia.checked = true
                            input_Tipo.value = res.ric_interesadotipo.t_id
                            input_Tipo_documento.value = res.ric_interesadodocumentotipo.t_id
                            input_Nombre.value = res.nombre
                            input_Sexo.value = res.ric_sexotipo.t_id
                            input_Razon_Social.value = res.razon_social
                            input_Grupo_Etnico.value = res.ric_grupoetnicotipo.t_id
                            input_Estado_Civil.value = res.ric_estadociviltipo.t_id
                        } else {
                            input_Existencia.checked = false
                            input_Tipo.value = undefined
                            input_Tipo_documento.value = undefined
                            input_Nombre.value = ""
                            input_Sexo.value = undefined
                            input_Razon_Social.value = ""
                            input_Grupo_Etnico.value = undefined
                            input_Estado_Civil.value = undefined
                        }
                    }
                })  
            }
    })
    return inputs_tr;
}

async function derechonuevo (derecho) {
    const form = document.createElement("form")
    const derecho_tittle = document.createElement("h2")
    derecho_tittle.innerText = "Derecho"
    form.appendChild(derecho_tittle)
    const table = document.createElement("table")
    const thead = document.createElement("thead")
    const tbody = document.createElement("tbody")
    const options = ["Guardar","Tipo", "Fracción", "Fecha inicio tenencia", "Descripción"]
    options.forEach((o) => {
        const th = document.createElement("th")
        th.innerText = o
        thead.appendChild(th)
    })
    tbody.appendChild(await derechonuevo_validacion(derecho))
    table.appendChild(thead)
    table.appendChild(tbody)
    form.appendChild(table)
    document.getElementById("derecho-nuevo").appendChild(form)
} 

async function derechonuevo_validacion (derecho) {
    const inputs_tr = document.createElement("tr")
    const td_input_guardar = document.createElement("td")
    const guardar = document.createElement("button")
    guardar.innerText = "+"
    td_input_guardar.appendChild(guardar)
    guardar.addEventListener("click", (e) => {
        e.preventDefault()
        if (validacion_inputs(inputs_tr)) {
            if (input_fraccion.value >= 0 && input_fraccion.value <= 1) {
                $.ajax({
                    url: "http://localhost:3000/ric_derechotipo/" + input_tipo.value,
                    type: "GET",
                    datatype: "JSON",
                    success: (res) => {
                        derecho[0].ric_derechotipo = res
                    }
                })
                derecho[0].fecha_inicio_tenencia = input_fit.value
                derecho[0].fraccion_derecho = parseFloat(input_fraccion.value)
                derecho[0].descripcion = input_descripcion.value
                alerta("Correcto!", "El derecho se agrego de manera correcta", "green")
            } else {
                alerta("Fraccion", "Ingrese un valor ente (0.0000000000 a 1.0000000000).", "red")
            }
        } else {
            alerta("Error", "Debe completar todos los campos", "red")
        }
    })
    inputs_tr.appendChild(td_input_guardar)
    const td_tipo = document.createElement("td")
    const input_tipo = document.createElement("select")
    input_tipo.required = true
    const input_tipo_options = await options("ric_derechotipo")
    input_tipo_options.required = true
    input_tipo_options.forEach((o) => {
        const option = document.createElement("option")
        option.value = o.t_id
        option.text = o.dispname
        input_tipo.appendChild(option)
    })
    td_tipo.appendChild(input_tipo)
    inputs_tr.appendChild(td_tipo)
    const td_input_fraccion = document.createElement("td")
    const input_fraccion = document.createElement("input")
    input_fraccion.type = "number"
    input_fraccion.required = true
    td_input_fraccion.appendChild(input_fraccion)
    inputs_tr.appendChild(td_input_fraccion)
    const td_input_fit = document.createElement("td")
    const input_fit = document.createElement("input")
    input_fit.required = true
    input_fit.type = "date"
    td_input_fit.appendChild(input_fit)
    inputs_tr.appendChild(td_input_fit)
    const td_input_descripcion = document.createElement("td")
    td_input_descripcion.className = "noval"
    const input_descripcion = document.createElement("input")
    td_input_descripcion.appendChild(input_descripcion)
    inputs_tr.appendChild(td_input_descripcion)
    return inputs_tr
}

async function fuenteadministrativanueva (fuenteadministrativa) {
    const form = document.createElement("form")
    form.addEventListener("submit", (e) => e.preventDefault())
    const table = document.createElement("table")
    const thead = document.createElement("thead")
    const tbody = document.createElement("tbody")
    const options = ["Agregar", "Tipo", "Ente Emisor", "Oficina Origen", "Ciudad Origen", "Observacion", "Numero Fuente", "Estado Disponibilidad", "Tipo Fuente", "Fecha de Documento Fuente"]
    options.forEach((o) => {
        const th = document.createElement("th")
        th.innerText = o
        thead.appendChild(th)
    })
    tbody.appendChild(await fuenteadministrativanueva_validacion(tbody, fuenteadministrativa))
    table.appendChild(tbody)
    table.appendChild(thead)
    form.appendChild(table)
    document.getElementById("fuente-nuevo").appendChild(form)
}

async function fuenteadministrativanueva_validacion (tbody, fuenteadministrativa) {
    const inputs_tr = document.createElement("tr")
    const td_agregar = document.createElement("td")
    const agregar = document.createElement("button")
    agregar.innerText = "+"
    td_agregar.addEventListener("click", () => {
        if (validacion_inputs(inputs_tr)) {
            const tr = document.createElement("tr")
            const td_void = document.createElement("td")
            tr.appendChild(td_void)
            const tipo = document.createElement("td")
            tipo.innerText = input_tipo[input_tipo.selectedIndex].text
            tr.appendChild(tipo)
            const ente_emisor = document.createElement("td")
            ente_emisor.innerText = input_ente_emisor.value
            tr.appendChild(ente_emisor)
            const oficina_origen = document.createElement("td")
            oficina_origen.innerText = input_oficina_origen.value
            tr.appendChild(oficina_origen)
            const ciudad_origen = document.createElement("td")
            ciudad_origen.innerText = input_ciudad_origen.value
            tr.appendChild(ciudad_origen)
            const observacion = document.createElement("td")
            observacion.innerText = input_observacion.value
            tr.appendChild(observacion)
            const numero_fuente = document.createElement("td")
            numero_fuente.innerText = input_numero_fuente.value
            tr.appendChild(numero_fuente)
            const estado_disponibilidad = document.createElement("td")
            estado_disponibilidad.innerText = input_estado_disponibilidad[input_estado_disponibilidad.selectedIndex].text
            tr.appendChild(estado_disponibilidad)
            const tipo_fuente = document.createElement("td")
            tipo_fuente.innerText = input_tipo_fuente[input_tipo_fuente.selectedIndex].text
            tr.appendChild(tipo_fuente)
            const fecha_documento_fuente = document.createElement("td")
            fecha_documento_fuente.innerText = input_fecha_documento_fuente.value
            tr.appendChild(fecha_documento_fuente)
            tbody.appendChild(tr)
            const fuente = {
                t_id: "",
                t_ili_tid: "",
                col_fuenteadministrativatipo: input_tipo.value,
                ente_emisor: input_ente_emisor.value,
                oficina_origen: input_oficina_origen.value,
                ciudad_origen: input_ciudad_origen.value,
                observacion: input_observacion.value,
                numero_fuente: input_numero_fuente.value,
                col_estadodisponibilidadtipo: input_estado_disponibilidad.value,
                ci_forma_presentacion_codigo: input_tipo_fuente.value,
                fecha_documento_fuente: input_fecha_documento_fuente.value,
                espacio_de_nombres: "RIC_FUENTEADMINISTRATIVA",
                local_id: "",
            }
            const data = fuenteadministrativa_objeto_respuesta(fuente)
            fuenteadministrativa.push(data)
        }
    })
    td_agregar.appendChild(agregar)
    inputs_tr.appendChild(td_agregar)
    const td_input_Tipo = document.createElement("td")
    const input_tipo = document.createElement("select")
    input_tipo.required = true
    const td_input_Tipo_options = await options("col_fuenteadministrativatipo")
    td_input_Tipo_options.forEach((o) => {
        const option = document.createElement("option")
        option.value = o.t_id
        option.text = o.dispname
        input_tipo.appendChild(option)
    })
    td_input_Tipo.appendChild(input_tipo)
    inputs_tr.appendChild(td_input_Tipo)
    const td_input_ente_emisor = document.createElement("td")
    const input_ente_emisor = document.createElement("input")
    input_ente_emisor.required = true
    td_input_ente_emisor.appendChild(input_ente_emisor)
    inputs_tr.appendChild(td_input_ente_emisor)
    const td_input_oficina_origen = document.createElement("td")
    const input_oficina_origen = document.createElement("input")
    input_oficina_origen.type = "number"
    input_oficina_origen.required = true
    td_input_oficina_origen.appendChild(input_oficina_origen)
    inputs_tr.appendChild(td_input_oficina_origen)
    const td_input_ciudad_origen = document.createElement("td")
    const input_ciudad_origen = document.createElement("input")
    input_ciudad_origen.required = true
    td_input_ciudad_origen.appendChild(input_ciudad_origen)
    inputs_tr.appendChild(td_input_ciudad_origen)
    const td_input_obervacion = document.createElement("td")
    const input_observacion = document.createElement("input")
    input_observacion.className = "noval"
    td_input_obervacion.appendChild(input_observacion)
    inputs_tr.appendChild(td_input_obervacion)
    const td_input_numero_fuente = document.createElement("td")
    const input_numero_fuente = document.createElement("input")
    input_numero_fuente.required = true
    td_input_numero_fuente.appendChild(input_numero_fuente)
    inputs_tr.appendChild(td_input_numero_fuente)
    const td_input_estado_disponibilidad = document.createElement("td")
    const input_estado_disponibilidad = document.createElement("select")
    input_estado_disponibilidad.required = true
    const input_estado_disponibilidad_options = await options("col_estadodisponibilidadtipo")
    input_estado_disponibilidad_options.required = true
    input_estado_disponibilidad_options.forEach((o) => {
        const option = document.createElement("option")
        option.value = o.t_id
        option.text = o.dispname
        input_estado_disponibilidad.appendChild(option)
    })
    td_input_estado_disponibilidad.appendChild(input_estado_disponibilidad)
    inputs_tr.appendChild(td_input_estado_disponibilidad)
    const td_input_tipo_fuente = document.createElement("td")
    const input_tipo_fuente = document.createElement("select")
    input_tipo_fuente.required = true
    const input_tipo_fuente_options = await options("ci_forma_presentacion_codigo")
    input_tipo_fuente_options.required = true
    input_tipo_fuente_options.forEach((o) => {
        const option = document.createElement("option")
        option.value = o.t_id
        option.text = o.dispname
        input_tipo_fuente.appendChild(option)
    })
    td_input_tipo_fuente.appendChild(input_tipo_fuente)
    inputs_tr.appendChild(td_input_tipo_fuente)
    const td_input_fecha_documento_fuente = document.createElement("td")
    const input_fecha_documento_fuente = document.createElement("input")
    input_fecha_documento_fuente.required = true
    input_fecha_documento_fuente.type = "date"
    td_input_fecha_documento_fuente.appendChild(input_fecha_documento_fuente)
    inputs_tr.appendChild(td_input_fecha_documento_fuente)
    return inputs_tr
}

async function options (id) {
    const res = await $.ajax({
        url: "http://localhost:3000/" +id+ "s",
        type: "GET",
        datatype: "JSON",
        success: (res) => {
        }
    })
    var voidarray = []
    const response = voidarray.concat([{dispname: "Seleccione una opción"}], res)
    return response
}

function interesado_objeto_respuesta (interesado) {
    $.ajax({
        url: "http://localhost:3000/ric_interesadotipo/" + interesado.ric_interesadotipo,
        type: "GET",
        datatype: "JSON",
        success: (res) => {
            interesado.ric_interesadotipo = res
        }
    })
    $.ajax({
        url: "http://localhost:3000/ric_interesadodocumentotipo/" + interesado.ric_interesadodocumentotipo,
        type: "GET",
        datatype: "JSON",
        success: (res) => {
            interesado.ric_interesadodocumentotipo = res
        }
    })
    $.ajax({
        url: "http://localhost:3000/ric_sexotipo/" + interesado.ric_sexotipo,
        type: "GET",
        datatype: "JSON",
        success: (res) => {
            interesado.ric_sexotipo = res
        }
    })
    $.ajax({
        url: "http://localhost:3000/ric_grupoetnicotipo/" + interesado.ric_grupoetnicotipo,
        type: "GET",
        datatype: "JSON",
        success: (res) => {
            interesado.ric_grupoetnicotipo = res
        }
    })
    $.ajax({
        url: "http://localhost:3000/ric_estadociviltipo/" + interesado.ric_estadociviltipo,
        type: "GET",
        datatype: "JSON",
        success: (res) => {
            interesado.ric_estadociviltipo = res
        }
    })
    return interesado;
}

function fuenteadministrativa_objeto_respuesta (fuente) {
    $.ajax({
        url: "http://localhost:3000/col_fuenteadministrativatipo/"+fuente.col_fuenteadministrativatipo,
        type: "GET",
        datatype: "JSON",
        success: (res) => {
            fuente.col_fuenteadministrativatipo = res
        }
    })
    $.ajax({
        url: "http://localhost:3000/col_estadodisponibilidadtipo/"+fuente.col_estadodisponibilidadtipo,
        type: "GET",
        datatype: "JSON",
        success: (res) => {
            fuente.col_estadodisponibilidadtipo = res
        }
    })
    $.ajax({
        url: "http://localhost:3000/ci_forma_presentacion_codigo/"+fuente.ci_forma_presentacion_codigo,
        type: "GET",
        datatype: "JSON",
        success: (res) => {
            fuente.ci_forma_presentacion_codigo = res
        }
    })
    return fuente
}

function crearDerecho (interesado, derecho, tipo) {
    if (tipo == "unico") {
        derecho.ric_interesado = interesado
        derecho.ric_agrupacioninteresados = null
    } else if (tipo == "agrupacion") {
        derecho.ric_agrupacioninteresados = interesado
        derecho.ric_interesado = null
    }
    $.ajax({
        url: "http://localhost:3000/actualizarDerecho",
        type: "PUT",
        data: JSON.stringify(derecho),
        contentType: 'application/json',
    })
    return derecho
}
function validacion_inputs (inputs) {
    const nodes = inputs.childNodes
    var validations = 0
    for (let node = 0; node < nodes.length; node++) {
        if (nodes[node].childNodes[0].className != "noval") {
            if (nodes[node].childNodes[0].nodeName == "INPUT"){
                if (nodes[node].childNodes[0].value != "") {
                    validations++
                }
            } else if (nodes[node].childNodes[0].nodeName == "SELECT") {
                if (nodes[node].childNodes[0].value != "undefined") {
                    validations++
                }
            }
        }
    } 
    if (validations >= nodes.length-2) {
        return true
    } else {
        return false
    }
}