export function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      resolve({
        success: false,
        message: "Geolocalização não é suportada pelo seu navegador.",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve({ success: true, data: { latitude, longitude } });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            resolve({
              success: false,
              message: "Permissão negada para acessar localização.",
            });
            break;
          case error.POSITION_UNAVAILABLE:
            resolve({
              success: false,
              message: "Localização indisponível.",
            });
            break;
          case error.TIMEOUT:
            resolve({
              success: false,
              message: "Tempo esgotado para obter localização.",
            });
            break;
          default:
            resolve({
              success: false,
              message: "Erro desconhecido.",
            });
            break;
        }
      }
    );
  });
}
export function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
