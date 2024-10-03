let table;
let user;
let idUser;
let visto = [];
let ocupado = [];
var visitados = [];
let cont;
var rojos = [];
const dificultad = {
    '1': [9, 10],
    '2': [16, 40],
    '3': [21, 99]
}
var dif = '2';
var tablero = dificultad[dif][0];
var minas = dificultad[dif][1];

window.onload = function () {
    table = document.getElementById('table');
    hacerTabla();
};

const hacerTabla = function () {
    for (let i = 0; i <= tablero; i++) {
        let tr = document.createElement('tr');
        for (let j = 0; j <= tablero; j++) {
            let td = document.createElement('td');
            td.setAttribute('id', i + '-' + j);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    ponerMinas();
    for (let i = 0; i <= tablero; i++) {
        for (let j = 0; j <= tablero; j++) {
            document.getElementById(i + '-' + j).addEventListener('mouseenter', cambiarCursor);
            document.getElementById(i + '-' + j).addEventListener('mouseleave', restablecer);
            document.getElementById(i + '-' + j).addEventListener('click', hacerClic);
        }
    }
}

const ponerMinas = function () {
    ocupado = [];
    for (let i = 0; i < minas; i++) {
        let uno = Math.floor(Math.random() * tablero);
        let dos = Math.floor(Math.random() * tablero);
        let lugar = uno + '-' + dos;
        if (inArray(ocupado, lugar)) {
            i--;
            continue;
        }
        ocupado[i] = lugar;
    }
    calcularMinas(ocupado);
}

const calcularMinas = function (minas) {
    let avisos = [];
    rojos = [];
    minas.forEach(mina => {
        let p = mina.split('-');
        let u = parseInt(p[0]);
        let d = parseInt(p[1]);
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                let ph1 = u + i;
                let ph2 = d + j;
                let resultado = desbordar(ph1) + '-' + desbordar(ph2);
                avisos.push(resultado);
            }
        }
    });
    avisos.forEach(aviso => {
        if(!inArray(ocupado, aviso)){
            rojos.push(aviso);
        }
    });
}

const cambiarCursor = function () {
    this.setAttribute('class', 'cursor');
}

const restablecer = function () {
    let res = document.getElementsByClassName('cursor');
    res[0].setAttribute('class', '');
}

const desbordar = function (num) {
    if (num < 0) {
        return 0;
    } else if (num > tablero) {
        return tablero;
    }
    return num;
}

const hacerClic = function (event) {
    if (!event.altKey) {
        marcarXClic(event.target.getAttribute('id'));
        visitados = [];
    } else {
        let marca = document.getElementsByClassName('cursor');
        if(marca[0].getAttribute('style')=='background-color:yellow'){
            marca[0].setAttribute('style', 'background-color:blue');
            return;
        }
        marca[0].setAttribute('style', 'background-color:yellow');
    }
}

const marcarXClic = function (id) {
    let marca = document.getElementById(id);
    if (inArray(ocupado, id)) {
        perder();
        return;
    }
    if (inArray(rojos, id)) {
        marca.setAttribute('style', 'background-color:red');
        marca.innerHTML = calcularAlrededor(id);
        return;
    }
    marca.setAttribute('style', 'background-color:green');
    visitados.push(id);
    let mostrar = recorrer(marca);
    for (let i = 0; i < mostrar.length; i++) {
        if (!inArray(visitados, mostrar[i])) {
            marcarXClic(mostrar[i]);
            visitados.push(mostrar[i]);
        }
    }
    visto = [];
}

const recorrer = function (lugar) {
    let mostrar = [];
    let id = lugar.getAttribute('id');
    let p = id.split('-');
    let u = parseInt(p[0]);
    let d = parseInt(p[1]);
    visto.push(id);
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            let ph1 = u + i;
            let ph2 = d + j;
            let resultado = desbordar(ph1) + '-' + desbordar(ph2);
            let quitar = false;
            visto.forEach(cas => {
                if (cas == resultado) {
                    quitar = true;
                }
            });
            if (!quitar) {
                visto.push(resultado);
                mostrar.push(resultado);
            }
        }
    }
    return mostrar;
}

const calcularAlrededor = function(id){
    cont = 0;
    let vistos = [];
    let p = id.split('-');
    let u = parseInt(p[0]);
    let d = parseInt(p[1]);
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            let ph1 = u + i;
            let ph2 = d + j;
            let resultado = desbordar(ph1) + '-' + desbordar(ph2);
            if(inArray(ocupado, resultado) && !inArray(vistos, resultado)){
                cont++;
                vistos.push(resultado);
            }
        }
    }
    return cont;
}

const perder = function (event) {
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    hacerTabla();
}

const inArray = function (arr, e) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == e) return true;
    }
    return false;
};

const cambiarDificultad = function (num) {
    dif = num;
    tablero = dificultad[dif][0];
    minas = dificultad[dif][1];
    perder();
}

// numeros en los rojos