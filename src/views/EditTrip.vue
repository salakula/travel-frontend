<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import PlaceServices from "../services/PlaceServices.js";
import TripPlaceServices from "../services/TripPlaceServices";
import DayServices from "../services/DayServices";
import TripServices from "../services/TripServices";

const route = useRoute();

const trip = ref({});
const places = ref([]);
const selectedPlace = ref({});
const tripPlaces = ref([]);
const days = ref([]);
const isAddPlace = ref(false);
const isEditPlace = ref(false);
const isAddStep = ref(false);
const isEditStep = ref(false);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const newDay = ref({
  id: undefined,
  day: undefined,
  weekday: undefined,
  description: undefined,
  hotelName: undefined,
  hotelAddress: undefined,
  hotelPhone: undefined,
  hotelLink: undefined,
  tripId: undefined,
  tripPlace: [],
});
const newPlace = ref({
  id: undefined,
  duration: undefined,
  tripId: undefined,
  dayId: undefined,
  placeId: undefined,
});

onMounted(async () => {
  await getTrip();
  await getTripPlaces();
  await getPlaces();
  await getDays();
});

async function getTrip() {
  await TripServices.getTrip(route.params.id)
    .then((response) => {
      trip.value = response.data[0];
    })
    .catch((error) => {
      console.log(error);
    });
}

async function updateTrip() {
  await TripServices.updateTrip(trip.value.id, trip.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${trip.value.name} updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getTrip();
}

async function getPlaces() {
  await PlaceServices.getPlaces()
    .then((response) => {
      places.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

async function getTripPlaces() {
  await TripPlaceServices.getTripPlacesForTrip(route.params.id)
    .then((response) => {
      tripPlaces.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function addPlace() {
  isAddPlace.value = false;
  newPlace.value.tripId = trip.value.id;
  newPlace.value.placeId = selectedPlace.value.id;
  delete newPlace.value.id;
  await TripPlaceServices.addTripPlace(newPlace.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Place added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getTripPlaces();
}

async function updatePlace() {
  isEditPlace.value = false;
  newPlace.value.tripId = trip.value.id;
  newPlace.value.placeId = selectedPlace.value.id;
  console.log(newPlace);

  await TripPlaceServices.updateTripPlace(newPlace.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${selectedPlace.value.name} updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getTripPlaces();
}

async function deletePlace(place) {
  await TripPlaceServices.deleteTripPlace(place)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${place.place.name} deleted successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getTripPlaces();
}

async function checkUpdatePlace() {
  if (newDay.value.tripPlace.length > 0) {
    console.log(newDay.value.tripPlace);
    for (let i = 0; i < newDay.value.tripPlace.length; i++) {
      newPlace.value.id = newDay.value.tripPlace[i].id;
      newPlace.value.duration = newDay.value.tripPlace[i].duration;
      newPlace.value.dayId = newDay.value.id;
      selectedPlace.value.id =
        newDay.value.tripPlace[i].placeId;
      await updatePlace();
    }
  }
}

async function getDays() {
  await DayServices.getDaysForTripWithPlaces(
    route.params.id
  )
    .then((response) => {
      days.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function addStep() {
  isAddStep.value = false;
  newDay.value.tripId = trip.value.id;
  delete newDay.value.id;
  await DayServices.addDay(newDay.value)
    .then((data) => {
      newDay.value.id = data.data.id;
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Step added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });

  await checkUpdatePlace();

  await getDays();
}

async function updateStep() {
  isEditStep.value = false;
  await DayServices.updateDay(newDay.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Step updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });

  await checkUpdatePlace();

  await getDays();
}

async function deleteStep(step) {
  await DayServices.deleteDay(step)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Step deleted successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });

  await getDays();
}

function openAddPlace() {
  newPlace.value.id = undefined;
  newPlace.value.duration = undefined;
  newPlace.value.dayId = undefined;
  newPlace.value.placeId = undefined;
  selectedPlace.value = undefined;
  isAddPlace.value = true;
}

function openEditPlace(place) {
  newPlace.value.id = place.id;
  newPlace.value.duration = place.quantity;
  newPlace.value.dayId = place.dayId;
  newPlace.value.placeId = place.placeId;
  selectedPlace.value = place.place;
  isEditPlace.value = true;
}

function openAddStep() {
  newDay.value.id = undefined;
  newDay.value.day = undefined;
  newDay.value.weekday = undefined;
  newDay.value.description = undefined;
  newDay.value.hotelName = undefined;
  newDay.value.hotelAddress = undefined;
  newDay.value.hotelPhone = undefined;
  newDay.value.hotelLink = undefined;
  newDay.value.tripPlace = [];
  isAddStep.value = true;
}

function openEditStep(step) {
  newDay.value.id = step.id;
  newDay.value.day = step.day;
  newDay.value.weekday = step.weekday;
  newDay.value.description = step.description;
  newDay.value.hotelName = step.hotelName;
  newDay.value.hotelAddress = step.hotelAddress;
  newDay.value.hotelPhone = step.hotelPhone;
  newDay.value.hotelLink = step.hotelLink;
  newDay.value.tripPlace = step.tripPlace;
  isEditStep.value = true;
}

function closeAddPlace() {
  isAddPlace.value = false;
}

function closeEditPlace() {
  isEditPlace.value = false;
}

function closeAddStep() {
  isAddStep.value = false;
}

function closeEditStep() {
  isEditStep.value = false;
}

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-container>
    <v-row align="center">
      <v-col cols="10"
        ><v-card-title class="pl-0 text-h4 font-weight-bold"
          >Edit Trip
        </v-card-title>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="rounded-lg elevation-5">
          <v-card-text>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="trip.name"
                  label="Name"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="trip.startDate"
                  label="Stard Date"
                  type="Date"
                ></v-text-field>
                <v-text-field
                  v-model="trip.endDate"
                  label="End Date"
                  type="Date"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-textarea
                  v-model="trip.description"
                  rows="10"
                  label="Description"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="pt-0">
            <v-btn variant="flat" color="primary" @click="updateTrip()"
              >Update Trip</v-btn
            >
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="rounded-lg elevation-5">
          <v-card-title
            ><v-row align="center">
              <v-col cols="10"
                ><v-card-title class="headline">Places </v-card-title>
              </v-col>
              <v-col class="d-flex justify-end" cols="2">
                <v-btn color="accent" @click="openAddPlace()">Add</v-btn>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="tripPlace in tripPlaces"
                :key="tripPlace.id"
              >
                <b
                  >{{ tripPlace.duration }}   hours
                 </b
                >
                at  {{ tripPlace.place.name }} {{
                  tripPlace.place.link
                }}
                <template v-slot:append>
                  <v-row>
                    <v-icon
                      class="mx-2"
                      size="x-small"
                      icon="mdi-pencil"
                      @click="openEditPlace(tripPlace)"
                    ></v-icon>
                    <v-icon
                      class="mx-2"
                      size="x-small"
                      icon="mdi-trash-can"
                      @click="deletePlace(tripPlace)"
                    ></v-icon>
                  </v-row>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="rounded-lg elevation-5">
          <v-card-title
            ><v-row align="center">
              <v-col cols="10"
                ><v-card-title class="headline">Steps </v-card-title>
              </v-col>
              <v-col class="d-flex justify-end" cols="2">
                <v-btn color="accent" @click="openAddStep()">Add</v-btn>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-table>
              <tbody>
                <tr v-for="day in days" :key="day.id">
                  <td>{{ day.date }}</td>
                  <td>{{ day.weekday }}</td>
                  <td>{{ day.description }}</td>
                  <td>{{ day.hotelName }}</td>
                  <td>{{ day.hotelAddress }}</td>
                  <td>{{ day.hotelPhone }}</td>
                  <td>{{ day.hotelLink }}</td>
                  <td>
                    <v-chip
                      size="small"
                      v-for="place in day.tripPlace"
                      :key="place.id"
                      pill
                      >{{ place.place.name }}</v-chip
                    >
                  </td>
                  <td>
                    <v-icon
                      size="x-small"
                      icon="mdi-pencil"
                      @click="openEditStep(day)"
                    ></v-icon>
                  </td>
                  <td>
                    <v-icon
                      size="x-small"
                      icon="mdi-trash-can"
                      @click="deleteStep(day)"
                    >
                    </v-icon>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text> </v-card
      ></v-col>
    </v-row>

    <v-dialog
      persistent
      :model-value="isAddPlace || isEditPlace"
      width="800"
    >
      <v-card class="rounded-lg elevation-5">
        <v-card-title class="headline mb-2">{{
          isAddPlace
            ? "Add Place"
            : isEditPlace
            ? "Edit Place"
            : ""
        }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="3">
              <v-text-field
                v-model="newPlace.duration"
                label="Duration (hours)"
                type="number"
                required
              >
              </v-text-field>
            </v-col>

            <v-col>
              <v-select
                v-model="selectedPlace"
                :items="places"
                item-title="name"
                item-value="description"
                label="Places"
                return-object
                required
              >
                <template v-slot:prepend>
                  {{
                    `${
                      selectedPlace && selectedPlace.description
                        ? selectedPlace.description
                        : ""
                    }${newPlace.duration > 1 ? " hours" : ""}`
                  }}
                  at
                </template>
              </v-select>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="flat"
            color="secondary"
            @click="
              isAddPlace
                ? closeAddPlace()
                : isEditPlace
                ? closeEditPlace()
                : false
            "
            >Close</v-btn
          >
          <v-btn
            variant="flat"
            color="primary"
            @click="
              isAddPlace
                ? addPlace()
                : isEditPlace
                ? updatePlace()
                : false
            "
            >{{
              isAddPlace
                ? "Add Place"
                : isEditPlace
                ? "Update Place"
                : ""
            }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog persistent :model-value="isAddStep || isEditStep" width="800">
      <v-card class="rounded-lg elevation-5">
        <v-card-title class="headline mb-2">
          {{ isAddStep ? "Add Step" : isEditStep ? "Edit Step" : "" }}
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newDay.date"
            label="Date"
            type="Date"
            required
          ></v-text-field>

          <v-textarea
            v-model="newDay.weekday"
            label="Day"
            required
          ></v-textarea>

          <v-textarea
            v-model="newDay.description"
            label="Description"
            required
          ></v-textarea>

          <v-textarea
            v-model="newDay.hotelName"
            label="HotelName"
            required
          ></v-textarea>

          <v-textarea
            v-model="newDay.hotelAddress"
            label="HotelAddress"
            required
          ></v-textarea>

          <v-textarea
            v-model="newDay.hotelPhone"
            label="HotelPhone"
            required
          ></v-textarea>

          <v-textarea
            v-model="newDay.hotelLink"
            label="HotelLink"
            required
          ></v-textarea>

          <v-select
            v-model="newDay.tripPlace"
            :items="tripPlaces"
            item-title="place.name"
            item-value="id"
            label="Places"
            return-object
            multiple
            chips
            required
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="flat"
            color="secondary"
            @click="
              isAddStep ? closeAddStep() : isEditStep ? closeEditStep() : false
            "
            >Close</v-btn
          >
          <v-btn
            variant="flat"
            color="primary"
            @click="isAddStep ? addStep() : isEditStep ? updateStep() : false"
            >{{
              isAddStep ? "Add Step" : isEditStep ? "Update Step" : ""
            }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar.value" rounded="pill">
      {{ snackbar.text }}

      <template v-slot:actions>
        <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
