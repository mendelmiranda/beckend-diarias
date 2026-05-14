/**
 * Converte valor em reais para texto por extenso (pt-BR), uso em memorandos.
 * Cobre valores usuais até milhões; centavos sempre citados.
 */
export function moedaPorExtensoPtBr(valor: number): string {
  if (!Number.isFinite(valor) || valor < 0) return 'valor inválido';
  const centavos = Math.round((valor + Number.EPSILON) * 100) % 100;
  const inteiro = Math.floor(Math.round((valor + Number.EPSILON) * 100) / 100);

  const extensoInt = inteiroParaExtenso(inteiro);
  const partes: string[] = [];
  if (inteiro === 0) partes.push('zero real');
  else if (inteiro === 1) partes.push('um real');
  else partes.push(`${extensoInt} reais`);
  if (centavos === 1) partes.push('e um centavo');
  else if (centavos > 1) partes.push(`e ${inteiroParaExtenso(centavos)} centavos`);
  return partes.join(' ');
}

const unidades = [
  '',
  'um',
  'dois',
  'três',
  'quatro',
  'cinco',
  'seis',
  'sete',
  'oito',
  'nove',
  'dez',
  'onze',
  'doze',
  'treze',
  'quatorze',
  'quinze',
  'dezesseis',
  'dezessete',
  'dezoito',
  'dezenove',
];

const dezenas = [
  '',
  '',
  'vinte',
  'trinta',
  'quarenta',
  'cinquenta',
  'sessenta',
  'setenta',
  'oitenta',
  'noventa',
];

const centenas = [
  '',
  'cento',
  'duzentos',
  'trezentos',
  'quatrocentos',
  'quinhentos',
  'seiscentos',
  'setecentos',
  'oitocentos',
  'novecentos',
];

function ate999(n: number): string {
  if (n === 0) return '';
  if (n === 100) return 'cem';
  const c = Math.floor(n / 100);
  const d = Math.floor((n % 100) / 10);
  const u = n % 10;
  const partes: string[] = [];
  if (c > 0) {
    partes.push(centenas[c]);
    if (d > 0 || u > 0) partes.push('e');
  }
  if (d === 1 || (d === 0 && u > 0 && n % 100 < 20)) {
    const resto = d * 10 + u;
    partes.push(unidades[resto]);
  } else {
    if (d > 1) partes.push(dezenas[d]);
    if (u > 0) {
      if (d > 1) partes.push('e');
      partes.push(unidades[u]);
    }
  }
  return partes.join(' ').replace(/\s+/g, ' ').replace(/\s+e\s+e\s+/g, ' e ').trim();
}

function inteiroParaExtenso(n: number): string {
  if (n === 0) return 'zero';
  if (n >= 1_000_000) {
    return `${n.toLocaleString('pt-BR')} (valor numérico)`;
  }
  if (n < 1000) return ate999(n);

  const mil = Math.floor(n / 1000);
  const resto = n % 1000;
  const partes: string[] = [];
  if (mil === 1) partes.push('mil');
  else partes.push(`${ate999(mil)} mil`);
  if (resto > 0) partes.push(ate999(resto));
  return partes.join(' e ').replace(/\s+e\s+e\s+/g, ' e ');
}
