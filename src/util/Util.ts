import * as moment from 'moment';



function dataAtual(d: Date) {    
    return d.setTime( d.getTime() - new Date().getTimezoneOffset()*60*1000 );
}

/* function dataHoraAtual() {  
    let d = new Date();  
    return d.setTime( d.getTime() - new Date().getTimezoneOffset()*60*1000 );
} */

function convertToDate(dateString: string) {
    let d = dateString.split("/");
    let dat = new Date(d[2] + '/' + d[1] + '/' + d[0]);
    return dat;     
}

function totalDeDias(inicio: Date, fim: Date) {
    return moment(fim).diff(moment(inicio), 'days') + 1;
}

const formataDataAmericana = (valor: Date | number) => {
    if (valor === null)
        return null;

    if (typeof valor === 'number')
        valor = new Date(valor);

    return moment(valor).format('MM-DD-yyyy');
}

const formataDataAmericanaBanco = (valor: Date | number) => {
    if (valor === null)
        return null;

    if (typeof valor === 'number')
        valor = new Date(valor);

    return moment(valor).format('yyyy-MM-DD');
}

function convertToDateDB(dateString: string) {
    let d = dateString.split("/");
    let dat = new Date(d[0] + '-' + d[1] + '-' + d[2]);
    return dat;     
}

export const Util = {
    dataAtual, convertToDate,totalDeDias, formataDataAmericana, formataDataAmericanaBanco, convertToDateDB
}