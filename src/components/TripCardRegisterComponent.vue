<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import TripPlaceServices from "../services/TripPlaceServices.js";
import TripServices from "../services/TripServices";


const router = useRouter();

const showDetails = ref(false);
const tripPlaces = ref([]);
const user = ref(null);
const isAdmin = ref(false);

const props = defineProps({
  trip: {
    required: true,
  },
});

onMounted(async () => {
  await getTripPlaces();
  user.value = JSON.parse(localStorage.getItem("user"));
  console.log(user.value);
  if (user.value !== null && user.value.role === "admin") {
    isAdmin.value = true;
  }

  if (user.value !== null) {
    isRegistered.value = props.trip.users.some((u) => u.id === user.value.id);
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

const isRegistered  = ref(false);

async function register(){
  console.log("register");
  
  TripServices.addUser(props.trip.id, user.value.id)
    .then((response) => {
      console.log(response);
      isRegistered.value = true;
      
    })
    .catch((error) => {
      console.log(error);
    });
}
</script>

<template>
  <v-card
    class="rounded-lg elevation-5 mb-8"
    @click="showDetails = !showDetails"
  >
    <v-card-title class="headline">
      <v-row align="center" cols="12">
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
          <v-col cols="2">
          <v-chip v-if="!isRegistered" @click="register" prepend-icon="mdi-plus" class="ma-2" color="teal" label>
            Register
          </v-chip>
          <v-chip v-else prepend-icon="mdi-check-all" class="ma-2" color="teal" label>
            Registered
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
      </v-card-text>
    </v-expand-transition>
  </v-card>
</template>
