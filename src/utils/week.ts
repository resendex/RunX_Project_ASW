/**
 * Devolve o início (segunda-feira às 00:00:00 UTC) e fim (domingo às 23:59:59 UTC)
 * da semana que contém a data fornecida.
 */
export function getWeekBounds(date: Date): { weekStart: Date; weekEnd: Date } {
  const d = new Date(date);
  const day = d.getUTCDay(); // 0 = domingo, 1 = segunda ...
  const diffToMonday = (day === 0 ? -6 : 1 - day);

  const weekStart = new Date(d);
  weekStart.setUTCDate(d.getUTCDate() + diffToMonday);
  weekStart.setUTCHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setUTCDate(weekStart.getUTCDate() + 6);
  weekEnd.setUTCHours(23, 59, 59, 999);

  return { weekStart, weekEnd };
}
