//variables

const carrito = document.querySelector('#carrito'); // los numerales # - hacen la referencia al id 
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarrito = document.querySelector('#vaciar-carrito')
const listaCurso = document.querySelector('#lista-cursos');

// variable carrito de compras, como let por que se va a llenar y vaciar, es un arreglo vacio por que el carrito cuando el usuario entra esra vacio

let articuloCarrito = [];



// eventos
cargarEventListeners();
function cargarEventListeners() {
    // cuando da click en "agregar añ carrito"
    listaCurso.addEventListener("click", agregarCurso);

    //elimina cursos del carrito
    carrito.addEventListener('click', eliminarCurso);



    //muestra los cursos de localStorage
    document.addEventListener('DOMContentLoaded', () => {
        articuloCarrito = JSON.parse(localStorage.getItem('carrito')) || [];

        carritoHTML();
    });




    // vaciar carrito 
    vaciarCarrito.addEventListener('click', () => {
        articuloCarrito = []; // resetear el arreglo
        limpiarHTML(); // limpiamos el html
    })
}


// funciones

function agregarCurso (e) {
    e.preventDefault();// para que no haga alguna accion indevida
    // saber si la clase corresponde al elemento
    if (e.target.classList.contains("agregar-carrito")) {
        const cursoSeleccionado = e.target.parentElement.parentElement;
        // traversing para ir del hijo al padre y seleccionar desde la clase card

        leerDatosCurso (cursoSeleccionado);
    }
}

// elimina curso del carrito
function eliminarCurso(e){
    e.preventDefault();

    if (e.target.classList.contains("borrar-curso")){
        const cursoId = e.target.getAttribute("data-id");

        //elimina del arreglo de articulosCarrito por el data id

        articuloCarrito = articuloCarrito.filter(curso => curso.id !== cursoId); // que se traiga todos exepto el eliminado

        carritoHTML(); // iterar sobre el carrito y mostrar el html
    }
}



// lee el contenido del html al que le dimos click y extrae la informacion del curso

function leerDatosCurso(curso) {
    //crear un objeto con el contenido del curso actual
    // tenemos la referencia del curso por eso se usa curso.querySelector y no document
    const infoCurso = {
        img: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        // selecciona de la clase precio el span
        precio: curso.querySelector('.precio span').textContent,
        // selecciona el id del enlace del curso disponible en html
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }

    // revisa si un elemento ya existe en el carrito 
    const existe = articuloCarrito.some( curso => curso.id === infoCurso.id) // si el curso sobre el que estamos iterando si es igual al objeto que estamos creando, si alguno es igual quiere decir que ya esta en el carrito ahi se actualizamos la cantidad

    if (existe) {// si ya esta en el carrito
        // actualizamos la cantidad
        
        // comprobar .map va a ir iterando en el carrito
        const cursos = articuloCarrito.map(curso => {
            if (curso.id === infoCurso.id){// cuando el curso actual del carrito sea igual al curso que estamos agregando aumenamos la cantidad
                curso.cantidad++;
                return curso; // asignamos el valor ya actualizado al arreglo que estamos creando con .map "cursos"
            } else {
                return curso; // retorna los objetos que no son los duplicados pero son los que el usuario esta escogiendo
            }
        });
        articuloCarrito = [...cursos]; // arma el arreglo con el arreglo de los cursos anterior
    }else { // o agregamos el curso al carrito
        articuloCarrito = [...articuloCarrito, infoCurso];
    }


    // agrega elementos al arreglo de carrito
    // spread operator ...
    // se toma una copia de lo que haya en el carrito y va contando
    //articuloCarrito = [...articuloCarrito, infoCurso]; pasa al else de arriba

    console.log(articuloCarrito);

    // mostrando el carrito en el html
    carritoHTML();
}


// muestra el carrito de compra en el html

function carritoHTML () {
    //limpiar el HTML
    limpiarHTML();
    
    
    // Recorre el carrito y genera el html
    articuloCarrito.forEach(curso => {
        // mejorar el codigo con destructuring
        const {img, titulo, precio, cantidad,id} = curso;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="text-align:center"><img src="${img}" width='120' alt="birce1"></td>
            <td style="text-align:left">${titulo}</td>
            <td style="text-align:center">${precio}</td>
            <td style="text-align:center">${cantidad}</td>
            <td><a href="#" class="borrar-curso" data-id="${id}"> x </a></td>
        `;

        //agrega el html del carrito en el tbody
        contenedorCarrito.appendChild(row);
    });

    //agregar el carrito de compras al storage
    sincronizarStorage();
}

//localStorage

function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(articuloCarrito));
}




// limpia los cursos del tbody

function limpiarHTML() {
    //forma lenta
    /* contenedorCarrito.innerHTML = ''; */


    // mejor perfomance
    while(contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild)
    }
}
/* 
    que hace el codigo while -- se ejecuta mientras la condicion sea veradadera

    contenedorCarrito.firstChild = este cogido se sigue ejecutando si hay al menos un elemento en el contenedorCarrito, una vez que es limpiado el html dentro del contenedor ya no se ejecuta 
*/



/*
    recapitulando hasta la linea 83
    Cuando agrego un curso se ejecuta la funcion agregar curso. 
    
    Nos aseguramos que el usuario haya precionado en agregar carrito y accedemos a todo el div que tiene el contenido del curso.
    
    leemos los datos del curso y creamos un objeto con la informacion que requerimos.
    
    lo agregamos al carrito de compras

    luego imprimimos el html,
    como estabamos teniendo dublicados lo primero que hacemos es limpiar el html previo y despues lo volvemos a generar de articuloCarrito
    este mantiene la referencia del carrito de compras, es decir que si hay uno o dos elementos va a generar de nueva cuenta ese html pero va a limpiar el html previo
*/

// eliminar elemto 