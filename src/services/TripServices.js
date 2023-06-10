import apiClient from "./services";

export default {
  getTrips() {
    return apiClient.get("trips");
  },
  getTripsByUserId(userId) {
    return apiClient.get("trips/user/" + userId);
  },
  getTrip(id) {
    return apiClient.get("trips/" + id);
  },
  addTrip(trip) {
    return apiClient.post("trips", trip);
  },
  updateTrip(tripId, trip) {
    return apiClient.put("trips/" + tripId, trip);
  },
  deleteTrip(tripId) {
    return apiClient.delete("trips/" + tripId);
  },
  addUser(tripId, userId) {
    return apiClient.post("trips/" + tripId + "/user/" + userId);
  }
};
