import * as moment from 'moment';


const calcularDiferencaDias = (dt1: Date, dt2: Date): number => {    
    const diff = dt2.getTime() - dt1.getTime();
    
    const dias = Math.round(diff / (1000 * 60 * 60 * 24));

    return Math.abs(dias);
}

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

const formataDataAmericana = () => {
    return moment(new Date()).format('MM-DD-yyyy');
}

const formataDataAmericanaComParametro = (data: Date) => {
    return moment(data).format('MM-DD-yyyy');
}

const subtractDays = (date: Date, days: number) => {
    date.setDate(date.getDate() - days);  
    return date;
  }

const formataDataAmericanaBanco = (valor: Date | number) => {
    if (valor === null)
        return null;

    if (typeof valor === 'number')
        valor = new Date(valor);

    return moment(valor).format('yyyy-MM-DD');
}

const horaAtual = () => {
    const data = new Date();
    return moment(data).format('HH:mm');
    }

function convertToDateDB(dateString: string) {
    let d = dateString.split("/");
    let dat = new Date(d[0] + '-' + d[1] + '-' + d[2]);
    return dat;     
}

export const Util = {
    dataAtual, convertToDate,totalDeDias, formataDataAmericana, formataDataAmericanaBanco, convertToDateDB, subtractDays, formataDataAmericanaComParametro, horaAtual, calcularDiferencaDias
}