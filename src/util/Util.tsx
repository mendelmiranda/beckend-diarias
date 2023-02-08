

function dataAtual(d: Date) {
    
    return d.setTime( d.getTime() - new Date().getTimezoneOffset()*60*1000 );
}

export const Util = {
    dataAtual,
}