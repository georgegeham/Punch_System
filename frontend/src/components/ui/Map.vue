<template>
  <v-col cols="12">
    <v-card flat tile>
      <div v-if="location" id="map" style="width: 100%; height: 33vh"></div>
      <div v-else class="text-center pa-4">
        <v-card-text>
          <p>Location not set</p>
        </v-card-text>
      </div>
    </v-card>
  </v-col>
</template>
<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
export default {
  name: "MyMap",
  props: {
    location: String,
    area: String,
    height: {
      type: String,
    },
    worker: {
      type: Object,
    },
    radius: String,
  },

  mounted() {
    this.tryInitMap();
  },
  beforeUnmount() {
    if (this.map) {
      this.map.remove();
    }
  },
  watch: {
    location(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.tryInitMap();
        });
      }
    },
    worker: {
      handler(newworker) {
        if (newworker && this.map) {
          this.updateWorkerMarker(newworker);
        }
      },
      deep: true,
    },
  },
  methods: {
    tryInitMap() {
      if (this.location && !this.map) {
        this.$nextTick(() => {
          if (this.$props.height) {
            const map = document.querySelector("#map");
            if (map) {
              map.style.height = this.$props.height;
            }
          }
          this.initMap();
        });
      }
    },
    initMap() {
      let latitude = null;
      let longitude = null;
      let area = null;
      const radius = this.radius ? Number(this.radius) : null;
      if (this.$props.location) {
        const locationParts = this.location.split(", ");
        latitude = parseFloat(locationParts[0]);
        longitude = parseFloat(locationParts[1]);
      }
      if (this.$props.area) {
        // console.log("Area:", this.$props.area);
        area = Number(this.$props.area);
      }

      if (!latitude || !longitude) {
        console.error("Business location not set");
        return;
      }

      this.map = L.map("map").setView([latitude, longitude], 17);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(this.map);

      const workplaceMarker = L.marker([latitude, longitude], {
        title: "Workplace",
      }).addTo(this.map);

      workplaceMarker.bindPopup("<b>Workplace Location</b>").openPopup();

      if (area) {
        // console.log(Math.round(Math.sqrt(area / Math.PI) * 1.3));
        this.circle = L.circle([latitude, longitude], {
          color: "#1976D2",
          fillColor: "#2196F3",
          fillOpacity: 0.2,
          radius: radius, // increasing radius by 0.3 factor for margining the error
        }).addTo(this.map);

        this.circle.bindPopup(`<b>Work Zone</b><br>Radius: ${area}m`);
      }
    },
    updateWorkerMarker(worker) {
      if (this.workerMarker) {
        this.map.removeLayer(this.workerMarker);
      }

      const { latitude, longitude, name } = worker;

      if (!latitude || !longitude) return;

      this.workerMarker = L.marker([latitude, longitude], {
        title: `${name} is here`,
        color: "#FFFFF",
      }).addTo(this.map);

      this.workerMarker.bindPopup(`<b>${name} is Here</b>`).openPopup();
      const point1 = L.latLng(latitude, longitude);
      const locationParts = this.location.split(", ");
      const point2 = L.latLng(
        parseFloat(locationParts[0]),
        parseFloat(locationParts[1])
      );
      const Bounds = L.latLngBounds(point1, point2);

      this.map.fitBounds(Bounds);
    },
  },
};
</script>
<style></style>
