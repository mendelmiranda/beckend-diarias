import { eachDayOfInterval, format, max as dfMax, min as dfMin } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';

export function normalizarCpf(cpf: string): string {
  return cpf.replace(/\D/g, '');
}

/** Lista de dias: "18, 19, 20, 21, 22 e 23 de maio de 2026" (mesmo mês/ano do primeiro dia) */
export function enumerarDiasPeriodoPt(dataIda: Date, dataVolta: Date | null): string {
  const fim = dataVolta ?? dataIda;
  const inicio = dataIda.getTime() <= fim.getTime() ? dataIda : fim;
  const fimOk = dataIda.getTime() <= fim.getTime() ? fim : dataIda;
  const dias = eachDayOfInterval({ start: inicio, end: fimOk });
  if (dias.length === 0) return '—';
  const mesAno = format(dias[0], "MMMM 'de' yyyy", { locale: ptBR });
  const nums = dias.map((d) => format(d, 'd'));
  if (nums.length === 1) return `${nums[0]} de ${mesAno}`;
  const ultimo = nums[nums.length - 1];
  const demais = nums.slice(0, -1);
  return `${demais.join(', ')} e ${ultimo} de ${mesAno}`;
}

export function formatarPeriodoEventoPt(inicio: Date, fim: Date): string {
  const mi = format(inicio, 'd', { locale: ptBR });
  const mf = format(fim, 'd', { locale: ptBR });
  const mesAno = format(fim, "MMMM 'de' yyyy", { locale: ptBR });
  if (format(inicio, 'yyyy-MM') === format(fim, 'yyyy-MM')) {
    return `${mi} a ${mf} de ${mesAno}`;
  }
  return `${format(inicio, "d 'de' MMMM 'de' yyyy", { locale: ptBR })} a ${format(fim, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}`;
}

export function formatarDiariasContadas(somaDiarias: number, valorUnitario: number): string {
  if (!Number.isFinite(somaDiarias) || somaDiarias <= 0) return '—';
  if (!Number.isFinite(valorUnitario) || valorUnitario <= 0) {
    return `${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(somaDiarias)} (total)`;
  }
  const q = somaDiarias / valorUnitario;
  const inteiro = Math.floor(q + 1e-6);
  const resto = q - inteiro;
  let s = `${inteiro} diária${inteiro !== 1 ? 's' : ''}`;
  if (resto > 0.35 && resto < 0.65) s += ' e ½';
  else if (resto > 0.08) s += ` (${q.toFixed(2).replace('.', ',')} apuração)`;
  return s;
}

export function fmtBrl(v: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
}

export function minMaxDatas(datas: Date[]): { min: Date | null; max: Date | null } {
  const ok = datas.filter(Boolean);
  if (ok.length === 0) return { min: null, max: null };
  return { min: dfMin(ok), max: dfMax(ok) };
}
