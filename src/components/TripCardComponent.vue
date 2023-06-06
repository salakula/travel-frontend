<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import TripPlaceServices from "../services/TripPlaceServices.js";
import DayServices from "../services/DayServices";

const router = useRouter();

const showDetails = ref(false);
const tripPlaces = ref([]);
const days = ref([]);
const user = ref(null);
const isAdmin = ref(false);

const props = defineProps({
  trip: {
    required: true,
  },
});

onMounted(async () => {
  await getTripPlaces();
  await getDays();
  user.value = JSON.parse(localStorage.getItem("user"));
  console.log(user.value);
  if (user.value !== null && user.value.role === "admin") {
    isAdmin.value = true;
  }
});

async function getTripPlaces() {
  await TripPlaceServices.getTripPlacesForTrip(props.trip.id)
    .then((response) => {
      tripPlaces.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function getDays() {
  await DayServices.getDaysForTripWithPlaces(
    props.trip.id
  )
    .then((response) => {
      days.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

function navigateToEdit() {
  router.push({ name: "editTrip", params: { id: props.trip.id } });
}
</script>

<template>
  <v-card
    class="rounded-lg elevation-5 mb-8"
    @click="showDetails = !showDetails"
  >
    <v-card-title class="headline">
      <v-row align="center">
        <v-col cols="10">
          {{ trip.name }}
          <v-chip class="ma-2" color="green" label>
            <v-icon start icon="mdi-ray-start-arrow"></v-icon>
            {{ trip.startDate  }} 
          </v-chip>
          <v-chip  append-icon="mdi-ray-end-arrow" class="ma-2" color="accent" label>
            {{ trip.endDate }} 
          </v-chip>
        </v-col>
        <v-col class="d-flex justify-end">
          <v-icon
            v-if="isAdmin"
            size="small"
            icon="mdi-pencil"
            @click="navigateToEdit()"
          ></v-icon>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text class="body-1">
      {{ trip.description }}
    </v-card-text>
    <v-expand-transition>
      <v-card-text class="pt-0" v-show="showDetails">
        <h3>Places</h3>
        <v-list>
          <v-list-item
            v-for="tripPlace in tripPlaces"
            :key="tripPlace.id"
          >
            <b
              >
              {{
                `${tripPlace.place.name}`
              }}</b
            >
          </v-list-item>
        </v-list>
        <h3>Trip Days</h3>
        <v-table>
          <thead>
            <tr>
              <th class="text-left">Date</th>
              <th class="text-left">Day</th>

              <th class="text-left">Description</th>
              <th class="text-left">Hotel name</th>
              <th class="text-left">Hotel link</th>
              <th class="text-left">Hotel number</th>
               <th class="text-left">Places</th>

            </tr>
          </thead>
          <tbody>
            <tr v-for="step in days" :key="step.id">
              <td>{{ step.date.substring(0,10)  }}</td>
              <td>{{ step.weekday }}</td>
              <td>{{ step.description }}</td>
              <td>{{ step.hotelName }}</td>
              <td><a target="_blank" :href="step.hotelLink" >Open</a></td>
              <td>{{ step.hotelPhone }}</td>
              <td>
                <v-chip class="mx-1 my-1" 
                  size="small"
                  v-for="place in step.tripPlace"
                  :key="place.id"
                  pill
                  >{{ place.place.name }}</v-chip
                >
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-expand-transition>
  </v-card>
</template>
