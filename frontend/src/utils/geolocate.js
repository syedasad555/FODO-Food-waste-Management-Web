export async function getCurrentPosition(options = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }) {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      return reject(new Error('Geolocation is not supported by this browser'));
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        resolve({ latitude, longitude });
      },
      (err) => reject(err),
      options
    );
  });
}

export async function autofillUserCoords(setValue) {
  try {
    const { latitude, longitude } = await getCurrentPosition();
    // setValue is react-hook-form's setValue or any setter
    if (typeof setValue === 'function') {
      try {
        setValue('pickupLocation.coordinates.latitude', latitude);
        setValue('pickupLocation.coordinates.longitude', longitude);
      } catch (e) {
        // fallback for requester form shape
        setValue('location.coordinates.latitude', latitude);
        setValue('location.coordinates.longitude', longitude);
      }
    }
    return { latitude, longitude };
  } catch (e) {
    throw e;
  }
}
