

export default class VerificadorDiarias {

    verificar(tipoDiaria: number, acompanha: string,cargo: string, classe: string, cargoComum: string[], cargoServidores: string[]){
        
        if (acompanha === "SIM" && tipoDiaria === TipoDiaria.DENTRO_ESTADO 
            && cargoComum.some(serv => cargo.trim().includes(serv.trim()) || classe.includes(serv.trim()))) {
            return ValorServidores.DENTRO_ESTADO_CARGO_COMUM_ACOMPANHANDO;
          } else if (acompanha === "NAO" && cargoComum.some(serv => cargo.trim().includes(serv.trim()) || classe.includes(serv.trim()))) {
            return ValorServidores.DENTRO_ESTADO_CARGO_COMUM;
          } 
      
          if (cargoServidores.some(serv => cargo.trim().includes(serv.trim()) || classe.includes(serv.trim()))) {
            return ValorServidores.DENTRO_ESTADO_CARGO_ACIMA;
          }     
         
      return 0;
    }
    
}

enum ValorServidores {
    DENTRO_ESTADO_CARGO_COMUM = 530.46,
    DENTRO_ESTADO_CARGO_COMUM_ACOMPANHANDO = 766.22,
    DENTRO_ESTADO_CARGO_ACIMA = 766.22,
    FORA_ESTADO_CARGO_COMUM = 589.40,
    FORA_ESTADO_CARGO_COMUM_ACOMPANHANDO = 851.36,
    FORA_ESTADO_CARGO_ACIMA = 851.36, 
    INTERNACIONAL_CARGO_COMUM = 327.00,
    INTERNACIONAL_CARGO_ACIMA = 472.00,
}

enum TipoDiaria {
    DENTRO_ESTADO = 1,
    FORA_ESTADO = 2,
    INTERNCIONAL = 3,    
}