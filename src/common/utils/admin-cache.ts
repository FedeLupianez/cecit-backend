/*
 * Clave de caché compartida para la verificación de admin de un partner.
 *
 * La usan AccountsService.verify_admin (invocado por AdminGuard) y
 * PartnersAdminsService.verify_admin. Ambas responden la misma pregunta con las
 * mismas reglas, así que comparten entrada: un acierto escrito por una sirve
 * para la otra. Centralizar la clave acá evita que una invalidación apunte a un
 * string distinto del que se escribió y deje una entrada stale.
 *
 * Solo se cachean aciertos. Un "no es admin" no se cachea para que un alta de
 * permisos surta efecto en la petición siguiente sin esperar al TTL.
 */
export function adminPartnerCacheKey(
  id_account: string,
  id_partner: string,
): string {
  return `admin-partner:${id_account}_${id_partner}`;
}
