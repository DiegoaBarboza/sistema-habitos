// Qual frase aparece hoje: muda todo dia, dentro das frases da semana em andamento.

import { diasEntre } from "@/lib/indicadores";

// Dia 1 = o dia em que a lição começou. Depois do 7º dia, as frases recomeçam.
export function indiceDaFrase(totalFrases: number, inicioLicao: string, hoje: string) {
  if (totalFrases === 0) return null;
  const dias = Math.max(1, diasEntre(inicioLicao, hoje).length);
  return (dias - 1) % totalFrases;
}

// Dia da jornada: conta desde o início da semana 1 (dia 1 = o próprio dia).
export function diaDaJornada(inicioJornada: string, hoje: string) {
  return Math.max(1, diasEntre(inicioJornada, hoje).length);
}
