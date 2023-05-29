import apiClient from "./services";

export default {
  getTripPlaces() {
    return apiClient.get("tripPlaces");
  },
  getTripPlacesForTrip(tripId) {
    return apiClient.get("trips/" + tripId + "/tripPlaces");
  },
  getTripPlacesForDay(tripId, dayId) {
    return apiClient.get(
      "trips/" +
        tripId +
        "/days/" +
        dayId +
        "/tripPlacesWithPlaces"
    );
  },
  getTripPlace(tripPlace) {
    return apiClient.get(
      "trips/" +
        tripPlace.tripId +
        "/tripPlaces/" +
        tripPlace.id
    );
  },
  addTripPlace(tripPlace) {
    return apiClient.post(
      "trips/" + tripPlace.tripId + "/tripPlaces",
      tripPlace
    );
  },
  updateTripPlace(tripPlace) {
    return apiClient.put(
      "trips/" +
        tripPlace.tripId +
        "/tripPlaces/" +
        tripPlace.id,
      tripPlace
    );
  },
  deleteTripPlace(tripPlace) {
    return apiClient.delete(
      "trips/" +
        tripPlace.tripId +
        "/tripPlaces/" +
        tripPlace.id
    );
  },
};
