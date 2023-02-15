import moment from "moment";


function dataAtual(d: Date) {
    
    return d.setTime( d.getTime() - new Date().getTimezoneOffset()*60*1000 );
}

function convertToDate(dateString: string) {
    let d = dateString.split("/");
    let dat = new Date(d[2] + '/' + d[1] + '/' + d[0]);
    return dat;     
}

export const Util = {
    dataAtual, convertToDate,
}