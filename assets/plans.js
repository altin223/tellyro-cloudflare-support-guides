/* Plan prices in USD (totals for the full duration), used by the pricing section and the order page.
   The backend charges from its own `plans` table, never from these numbers, so keep both in sync. */
window.TELLYRO_PLANS=Object.freeze({
  devices:[1,2,3],
  months:[1,3,6,12,24],
  prices:{1:{1:17.90,3:29.90,6:49.90,12:79.90,24:129.90},2:{1:34.90,3:55.90,6:79.90,12:129.90,24:229.90},3:{1:49.90,3:79.90,6:109.90,12:179.90,24:299.90}}
});
