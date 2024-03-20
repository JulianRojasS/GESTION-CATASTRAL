$(document).ready(() => {
    const formulario = $('.formulario');
    const input = document.querySelectorAll('#formulario input')
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
                    window.location.reload()
                }
            }
        })
    })
    input.forEach((input)=>{
        input.addEventListener('keyup',Validarform)
        input.addEventListener('blur',Validarform)
    }) 
})
const expresiones = {
	password: /^.{4,12}$/, // 4 a 12 digitos.
	correo: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
}
const Validarform=(e)=>{
    switch(e.target.name){
        case "correo":
            if(expresiones.correo.test(e.target.value)){
            }else{
                document.getElementById('grupo__correo').classList.add('formulario__grupo-correcto')
            }     
        break;

        case "password":
             
        break;
    }
}
