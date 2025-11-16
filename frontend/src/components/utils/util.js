export const calculateRadius = (Area) => {
  return Math.round(Math.sqrt(Area / Math.PI) * 1.3);
};
export const timeToMinutes = (timeString) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
};

export const getLocation = (store) => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      const error = "Geolocation is not supported by your browser";
      store.commit("app/showSnackbar", {
        text: error,
        color: "error",
      });
      reject(new Error(error));
      return;
    }

    store.commit("app/showSnackbar", {
      text: "Capturing location...",
      color: "info",
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const location = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

        store.commit("app/showSnackbar", {
          text: "Location captured successfully!",
          color: "success",
        });

        resolve({ latitude, longitude, location });
      },
      (error) => {
        let errorMessage = "Unable to retrieve location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location permission denied. Please enable location access.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }

        store.commit("app/showSnackbar", {
          text: errorMessage,
          color: "error",
        });

        console.log(error);
        reject(error);
      }
    );
  });
};

export function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}
