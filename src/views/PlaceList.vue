<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import PlaceServices from "../services/PlaceServices.js";

const places = ref([]);
const isAdd = ref(false);
const isEdit = ref(false);
const user = ref(null);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const newPlace = ref({
  id: undefined,
  name: undefined,
  description: undefined,
  link: undefined,
});

onMounted(async () => {
  await getPlaces();
  user.value = JSON.parse(localStorage.getItem("user"));
});

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



async function deletePlace(place){

  if(confirm("Are you sure you want to delete place") === true){
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

function openAdd() {
  newPlace.value.name = undefined;
  newPlace.value.description = undefined;
  newPlace.value.link = undefined;
  isAdd.value = true;
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

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-container>

    <v-app-bar color="teal" prominent>
      <v-app-bar-title>Places</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn prepend-icon="mdi-plus" text @click="openAdd()">Add place</v-btn>
    </v-app-bar>

      <v-card v-if="places.length >0" class="rounded-lg elevation-5">

        <v-table class="rounded-lg elevation-5">
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">Description</th>
            <th class="text-left">Link</th>
            <th class="text-left">Edit</th>
            <th class="text-left">Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in places" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.description }}</td>
            <td><a :href="item.link">{{ item.link }}</a></td>
            <td>
              <v-icon
                size="small"
                icon="mdi-pencil"
                @click="openEdit(item)"
              ></v-icon>
            </td>
            <td>
              <v-icon
                size="small"
                icon="mdi-delete"
                @click="deletePlace(item)"
              ></v-icon>
            </td>
          </tr>
        </tbody>
      </v-table>
      </v-card>

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

      <v-snackbar v-model="snackbar.value" :color="snackbar.color" timeout="3000">
        {{ snackbar.value.text }}
        <template v-slot:action="{ attrs }">
          <v-btn text v-bind="attrs" @click="closeSnackBar">Close</v-btn>
        </template>
      </v-snackbar>
  </v-container>
</template>
