<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";
import TripCard from "../components/TripCardComponent.vue";
import TripServices from "../services/TripServices.js";
import PlaceServices from "../services/PlaceServices.js";
import HotelServices from "../services/HotelServices.js";

const router = useRouter();
const user = ref(null);
const title = ref("Travel Itinerary");
const drawer = ref(false);


const showingUsers = ref(false);
const showingTrips = ref(false);
const showingPlaces = ref(false);
const showingHotels = ref(false);

async function showUsers() {
    showingUsers.value = true;
    showingTrips.value = false;
    showingPlaces.value = false;
    showingHotels.value = false;
    await getUsers();
    drawer.value = false;
}

async function showTrips() {
    showingUsers.value = false;
    showingTrips.value = true;
    showingPlaces.value = false;
    showingHotels.value = false;
    await getTrips();
    drawer.value = false;
}

async function showPlaces() {
    showingUsers.value = false;
    showingTrips.value = false;
    showingPlaces.value = true;
    showingHotels.value = false;
    await getPlaces();
    drawer.value = false;
}

async function showHotels() {
    showingUsers.value = false;
    showingTrips.value = false;
    showingPlaces.value = false;
    showingHotels.value = true;
    await getHotels();
    drawer.value = false;
}

const snackbar = ref({
    value: false,
    color: "",
    text: "",
});

const userList = ref([]);

async function getUsers() {
    UserServices.getUsers()
        .then((data) => {
            userList.value = data.data;
        })
        .catch((error) => {
            console.log(error);
        });
}

const trips = ref([]);

async function getTrips() {
    TripServices.getTrips()
        .then((data) => {
            trips.value = data.data;
        })
        .catch((error) => {
            console.log(error);
        });
}

async function makeAdmin(user) {
    user.role = "admin";
    UserServices.makeAdmin(user)
        .then((data) => {
            console.log(data);
            snackbar.value.value = true;
            snackbar.value.color = "green";
            snackbar.value.text = "User made admin successfully!";
            getUsers();
        })
        .catch((error) => {
            console.log(error);
        });
}

onMounted(async () => {
    user.value = JSON.parse(localStorage.getItem("user"));

    if (user.value === null) {
        router.push({ name: "login" });
    }
    else {
        await getTrips();
        showTrips();
    }
});

function logout() {
    UserServices.logoutUser()
        .then((data) => {
            console.log(data);
        })
        .catch((error) => {
            console.log(error);
        });
    localStorage.removeItem("user");
    user.value = null;
    router.push({ name: "login" });
}


const places = ref([]);

async function getPlaces() {
    try {
        const response = await PlaceServices.getPlaces();
        places.value = response.data;
    } catch (error) {
        console.log(error);
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = error.response.data.message;
    }
}

async function addPlace() {
    isAdd.value = false;
    delete newPlace.id;
    try {
        await PlaceServices.addPlace(newPlace.value);
        snackbar.value.value = true;
        snackbar.value.color = "success";
        snackbar.value.text = `${newPlace.value.name} added successfully!`;
    } catch (error) {
        console.log(error);
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = error.response.data.message;
    }
    await getPlaces();
}

async function updatePlace() {
    isEdit.value = false;
    try {
        await PlaceServices.updatePlace(newPlace.value);
        snackbar.value.value = true;
        snackbar.value.color = "success";
        snackbar.value.text = `${newPlace.value.name} updated successfully!`;
    } catch (error) {
        console.log(error);
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = error.response.data.message;
    }
    await getPlaces();
}

async function deletePlace(place) {

    if (confirm("Are you sure you want to delete place") === true) {
        try {
            await PlaceServices.deletePlace(place.id);
            snackbar.value.value = true;
            snackbar.value.color = "success";
            snackbar.value.text = `${place.name} deleted successfully!`;
        } catch (error) {
            console.log(error);
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = error.response.data.message;
        }
        await getPlaces();
    }
}

function closeAdd() {
    isAdd.value = false;
}

function openEdit(item) {
    newPlace.value.id = item.id;
    newPlace.value.name = item.name;
    newPlace.value.description = item.description;
    newPlace.value.link = item.link;
    isEdit.value = true;
}

function closeEdit() {
    isEdit.value = false;
}

const isAdd = ref(false);
const isEdit = ref(false);

const newPlace = ref({
    id: undefined,
    name: undefined,
    description: undefined,
    link: undefined,
});

function openAdd() {
    newPlace.value.name = undefined;
    newPlace.value.description = undefined;
    newPlace.value.link = undefined;
    isAdd.value = true;
}


function updateStatus(place) {
    place.is_active = place.is_active ? false : true;
    PlaceServices.updatePlace(place)
        .then((data) => {
            console.log(data);
            snackbar.value.value = true;
            snackbar.value.color = "success";
            snackbar.value.text = `${place.name} updated successfully!`;
            getPlaces();
        })
        .catch((error) => {
            console.log(error);
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = error.response.data.message;
        });
}

async function addTrip() {
  isAddTrip.value = false;
  newTrip.value.userId = user.value.id;
  try {
    await TripServices.addTrip(newTrip.value);
    snackbar.value.value = true;
    snackbar.value.color = "success";
    snackbar.value.text = `${newTrip.value.name} added successfully!`;
  } catch (error) {
    console.log(error);
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = error.response.data.message;
  }
  await getTrips();
}

const isAddTrip = ref(false);

const newTrip = ref({
  name: "",
  description: "",
  startDate: "",
  endDate: "",
});

function openAddTrip() {
    isAddTrip.value = true;
}

function closeAddTrip() {
    isAddTrip.value = false;
}

const hotels = ref([]);
const isAddHotel = ref(false);
const isEditHotel = ref(false);

const newHotel = ref({
  name: "",
  description: "",
  address: "",
  phone: "",
  link: "",
});

function openAddHotel() {
    isAddHotel.value = true;
}

function closeAddHotel() {
    isAddHotel.value = false;
}

function openEditHotel(hotel) {
    newHotel.value.id = hotel.id;
    newHotel.value.name = hotel.name;
    newHotel.value.description = hotel.description;
    newHotel.value.address = hotel.address;
    newHotel.value.phone = hotel.phone;
    newHotel.value.link = hotel.link;
    isEditHotel.value = true;
}

function closeEditHotel() {
    isEditHotel.value = false;
}

async function addHotel() {
    isAddHotel.value = false;
    newHotel.value.userId = user.value.id;
    try {
      await HotelServices.addHotel(newHotel.value);
      snackbar.value.value = true;
      snackbar.value.color = "success";
      snackbar.value.text = `${newHotel.value.name} added successfully!`;
    } catch (error) {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    }
    await getHotels();
  }

async function updateHotel() {
    isEditHotel.value = false;
    try {
        await HotelServices.updateHotel(newHotel.value);
        snackbar.value.value = true;
        snackbar.value.color = "success";
        snackbar.value.text = `${newHotel.value.name} updated successfully!`;
    } catch (error) {
        console.log(error);
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = error.response.data.message;
    }
    await getHotels();
}

async function getHotels() {
    try {
        const response = await HotelServices.getHotels();
        hotels.value = response.data;
    } catch (error) {
        console.log(error);
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = error.response.data.message;
    }
}

async function updateStatusHotel(temp){
    temp.is_active = temp.is_active ? false : true;
    HotelServices.updateHotel(temp)
        .then((data) => {
            console.log(data);
            snackbar.value.value = true;
            snackbar.value.color = "success";
            snackbar.value.text = `${temp.name} updated successfully!`;
            getHotels();
        })
        .catch((error) => {
            console.log(error);
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = error.response.data.message;
        });
}

async function showProfile() {
    router.push({ name: "profile" });
}

function closeSnackBar() {
    snackbar.value.value = false;
}
</script>
<template>
    <v-app-bar color="teal" prominent>
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-app-bar-title>{{ title }}</v-app-bar-title>
        <v-spacer></v-spacer>
        <v-avatar class="mr-5" @click="showProfile" v-if="user != null" color="white">{{ user.firstName[0].toUpperCase() + user.lastName[0].toUpperCase() }}</v-avatar>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" location="left" temporary>
        <v-list>
            <v-list-item prepend-icon="mdi-account" v-if="user" :title="user.firstName + ' ' + user.lastName"></v-list-item>
            <v-list-item prepend-icon="mdi-account-details" @click="showUsers()" title="Users"></v-list-item>
            <v-list-item prepend-icon="mdi-airplane" @click="showTrips()" title="Trips"></v-list-item>
            <v-list-item prepend-icon="mdi-map-marker" @click="showPlaces()" title="Places"></v-list-item>
            <v-list-item prepend-icon="mdi-home-city" @click="showHotels()" title="Hotels"></v-list-item>
            <v-list-item style="color: red;" @click="logout()" prepend-icon="mdi-logout-variant"
                title="Logout"></v-list-item>
        </v-list>
    </v-navigation-drawer>

    <template v-if="showingUsers">
        <v-container>
            <v-card-title>
                <h2>Users</h2>
            </v-card-title>
            <v-card class="rounded-lg elevation-5 mb-8" v-for="user in userList" :key="user.id" prepend-icon="mdi-account"
                :title="user.firstName + ' ' + user.lastName" :subtitle="user.email">
                <v-card-actions v-if="user.role === 'user'">
                    <v-spacer></v-spacer>
                    <v-btn variant="flat" color="teal" text @click="makeAdmin(user)">Make admin</v-btn>
                </v-card-actions>
            </v-card>
        </v-container>
    </template>

    <template v-if="showingTrips">
        <v-container>
            <v-row>
                <v-col cols="12">
                    <v-card-title class="mx-10 my-3 py-3">
                        <v-row>
                    <h2>Trips</h2>
                    <v-spacer></v-spacer>
                    <v-btn variant="flat" color="teal" prepend-icon="mdi-plus" text @click="openAddTrip()">Add trip</v-btn>
                </v-row>
                    </v-card-title>
                    <v-card-text v-if="trips.length > 0">
                        <TripCard v-for="trip in trips" :key="trip.id" :trip="trip" @deletedList="getLists" />
                    </v-card-text>
                </v-col>
            </v-row>
        </v-container>

    </template>

    <template v-if="showingPlaces">
        <v-container>
            <v-card-title class="mx-10 my-3 py-3">
                <v-row>
                    <h2>Places</h2>
                    <v-spacer></v-spacer>
                    <v-btn variant="flat" color="teal" prepend-icon="mdi-plus" text @click="openAdd()">Add place</v-btn>
                </v-row>
            </v-card-title>
            <v-card v-if="places.length > 0" class="rounded-lg elevation-5 mx-10 my-5">


                <v-table class="rounded-lg elevation-5">
                    <thead>
                        <tr>
                            <th class="text-left">Name</th>
                            <th class="text-left">Description</th>
                            <th class="text-left">Link</th>
                            <th class="text-left">Edit</th>
                            <th class="text-left">Activate/deactivate</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in places" :key="item.name">
                            <td>{{ item.name }}</td>
                            <td>{{ item.description }}</td>
                            <td><a :href="item.link" target="_blank">{{ item.link }}</a></td>
                            <td>
                                <v-icon size="small" icon="mdi-pencil" @click="openEdit(item)"></v-icon>
                            </td>
                            <td>
                                <v-chip v-if="item.is_active" label color="red"  @click="updateStatus(item)" prepend-icon="mdi-refresh">De-activate</v-chip>
                                <v-chip v-else label prepend-icon="mdi-refresh" @click="updateStatus(item)" color="green">Activate</v-chip>
                            </td>
                        </tr>
                    </tbody>
                </v-table>
            </v-card>
        </v-container>
    </template>

    <template v-if="showingHotels">
        <v-container>
            <v-card-title class="mx-10 my-3 py-3">
                <v-row>
                    <h2>Hotels</h2>
                    <v-spacer></v-spacer>
                    <v-btn variant="flat" color="teal" prepend-icon="mdi-plus" text @click="openAddHotel()">Add hotel</v-btn>
                </v-row>
            </v-card-title>
            <v-card v-if="hotels.length > 0" class="rounded-lg elevation-5 mx-10 my-5">


                <v-table class="rounded-lg elevation-5">
                    <thead>
                        <tr>
                            <th class="text-left">Name</th>
                            <th class="text-left">Description</th>
                            <th class="text-left">Address</th>
                            <th class="text-left">Phone</th>
                            <th class="text-left">Link</th>
                            <th class="text-left">Edit</th>
                            <th class="text-left">Activate/deactivate</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in hotels" :key="item.name">
                            <td>{{ item.name }}</td>
                            <td>{{ item.description }}</td>
                            <td>{{ item.address }}</td>
                            <td>{{ item.phone }}</td>
                            <td><a :href="item.link" target="_blank">{{ item.link }}</a></td>
                            <td>
                                <v-icon size="small" icon="mdi-pencil" @click="openEditHotel(item)"></v-icon>
                            </td>
                            <td>
                                <v-chip v-if="item.is_active" label color="red"  @click="updateStatusHotel(item)" prepend-icon="mdi-refresh">De-activate</v-chip>
                                <v-chip v-else label prepend-icon="mdi-refresh" @click="updateStatusHotel(item)" color="green">Activate</v-chip>
                            </td>
                        </tr>
                    </tbody>
                </v-table>
            </v-card>
        </v-container>
    </template>

    <v-dialog persistent :model-value="isAdd || isEdit" width="500">
        <v-card class="rounded-lg elevation-5">
            <v-card-title class="headline mb-2">
                {{ isAdd ? "Add Place" : isEdit ? "Edit Place" : "" }}
            </v-card-title>
            <v-card-text>
                <v-text-field v-model="newPlace.name" label="Name" required></v-text-field>
                <v-text-field v-model="newPlace.description" label="Description" required></v-text-field>
                <v-text-field v-model="newPlace.link" label="Link"></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="isAdd ? closeAdd() : isEdit ? closeEdit() : false">Close</v-btn>
                <v-btn variant="flat" color="teal" @click="isAdd ? addPlace() : isEdit ? updatePlace() : false">
                    {{ isAdd ? "Add Place" : isEdit ? "Update Place" : "" }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>


    <v-dialog persistent :model-value="isAddHotel || isEditHotel" width="500">
        <v-card class="rounded-lg elevation-5">
            <v-card-title class="headline mb-2">
                {{ isAddHotel ? "Add Place" : isEditHotel ? "Edit Place" : "" }}
            </v-card-title>
            <v-card-text>
                <v-text-field v-model="newHotel.name" label="Name" required></v-text-field>
                <v-text-field v-model="newHotel.description" label="Description" required></v-text-field>
                <v-text-field v-model="newHotel.address" label="Address" required></v-text-field>
                <v-text-field v-model="newHotel.phone" label="Phone" required></v-text-field>
                <v-text-field v-model="newHotel.link" label="Link"></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="isAddHotel ? closeAddHotel() : isEditHotel ? closeEditHotel() : false">Close</v-btn>
                <v-btn variant="flat" color="teal" @click="isAddHotel ? addHotel() : isEditHotel ? updateHotel() : false">
                    {{ isAddHotel ? "Add Hotel" : isEditHotel ? "Update Hotel" : "" }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="isAddTrip" max-width="500px">
        <v-card>
          <v-card-title class="headline mb-2">Add Trip</v-card-title>
          <v-card-text>
            <v-text-field v-model="newTrip.name" label="Name" required></v-text-field>
            <v-row>
              <v-col cols="6">
                <v-text-field v-model="newTrip.startDate" label="Start Date" type="date"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="newTrip.endDate" label="End Date" type="date"></v-text-field>
              </v-col>
            </v-row>
            <v-textarea v-model="newTrip.description" label="Description"></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn  @click="closeAddTrip">Close</v-btn>
            <v-btn color="teal" @click="addTrip">Add Trip</v-btn>
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
</template>
