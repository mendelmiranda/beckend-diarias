/** Variantes de CPF para busca/gravação (só dígitos e mascarado). */
export function variantesCpf(cpf: string | null | undefined): string[] {
  const digits = (cpf ?? '').replace(/\D/g, '');
  if (digits.length === 11) {
    return [
      digits,
      `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`,
    ];
  }
  const trimmed = cpf?.trim();
  return trimmed ? [trimmed] : [];
}

export type ContaDiariaInput = {
  id?: number;
  nome?: string;
  cpf?: string;
  tipo?: string;
  tipo_conta?: string;
  agencia?: string;
  conta?: string;
  banco_id?: number;
};
