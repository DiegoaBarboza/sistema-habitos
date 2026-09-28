// "Dia" é sempre o dia no fuso do usuário, no formato AAAA-MM-DD (o mesmo de checkins.dia).
export function diaNoFuso(instante: Date | string, fuso: string): string {
  const d = typeof instante === "string" ? new Date(instante) : instante;
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: fuso,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}
