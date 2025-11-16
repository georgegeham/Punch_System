import Echo from "laravel-echo";
import Pusher from "pusher-js";

const token = JSON.parse(localStorage.getItem("token"));
window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: "pusher",
  key: process.env.VUE_APP_PUSHER_APP_KEY,
  cluster: process.env.VUE_APP_PUSHER_APP_CLUSTER,
  authEndpoint: `${process.env.VUE_APP_BASE_URL}/broadcasting/auth`,
  auth: { headers: { Authorization: `Bearer ${token}` } },
});

export default echo;
