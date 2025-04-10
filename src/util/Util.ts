//import moment from 'moment';

const moment = require('moment');
import Moment from 'moment';


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

/* function totalDeDias(inicio: Date, fim: Date) {
    return moment(fim).diff(moment(inicio), 'days') + 1;
} */

    export function totalDeDias(dataInicial: Date, dataFinal: Date): number {
        return moment(dataFinal).diff(moment(dataInicial), 'days');
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

const dateOptionsHourShort: object = {
	year: "numeric",
	month: "numeric",
	day: "numeric",
    hour: "numeric",
    minute: "numeric",
};

const dateOptionsShort: object = {
	year: "numeric",
	month: "numeric",
	day: "numeric",
};

function formataDataCurtaComHora(data: Date) {
    const formattedPublishDate = new Date(data).toLocaleDateString("pt-BR", dateOptionsHourShort);
    return formattedPublishDate;
}

export function formataDataCurta(data: Date) {
    const formattedPublishDate = new Date(data).toLocaleDateString("pt-BR", dateOptionsShort);
    return formattedPublishDate;
}

const formataValorDiaria = (valor: number, destino: string) => {
    if (destino === "INTERNACIONAL") {
        return Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(valor);
    }
    return Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
}

function formataMascaraCpf(cpf: string){
    return cpf
        .replace(/[^\d]/g, "")
        .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export function formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  const formataDataDate = (valor?: Date) => {
    if(valor === null)
        return null;

    if (typeof valor === 'number')
        valor = new Date(valor);

    return Moment(valor).format('DD/MM/yyyy');
}  

const formataDataNovas = (valor: Date | number | null | undefined) => {
    if (valor === null)
        return null;

    if (typeof valor === 'number')
        valor = new Date(valor);

    
    moment.locale('pt-br');
    
    return moment(valor).format('DD/MM/yyyy');
}



export const Util = {
    dataAtual, convertToDate,totalDeDias, formataDataAmericana, formataDataAmericanaBanco, 
    convertToDateDB, subtractDays, formataDataAmericanaComParametro, horaAtual, calcularDiferencaDias,
    formataDataCurtaComHora, formataMascaraCpf, formataDataDate, formataValorDiaria, formataDataNovas
}

