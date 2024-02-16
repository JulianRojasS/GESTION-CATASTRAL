const formulario =document.getElementById('formulario');
const input = document.querySelectorAll('#formulario input')

const expresiones = {
	password: /^.{4,12}$/, // 4 a 12 digitos.
	correo: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
}

const Validarform=(e)=>{
    switch(e.target.name){
        case "correo":
            if(expresiones.correo.test(e.target.value)){

            }else{
                document.getElementById('grupo__correo').classLista.add('formulario__grupo-correcto')
            }     
        break;

        case "password":
             
        break;
    }
}


input.forEach((input)=>{
    input.addEventListener('keyup',Validarform)
    input.addEventListener('blur',Validarform)
}) 

formulario.addEventListener('submit',(e)=> {
    //agregar otra ruta
})