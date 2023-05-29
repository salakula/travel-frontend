import apiClient from "./services";

export default {
  getDays() {
    return apiClient.get("days");
  },
  getDaysForTrip(tripId) {
    return apiClient.get("trips/" + tripId + "/days");
  },
  getDaysForTripWithPlaces(tripId) {
    return apiClient.get("trips/" + tripId + "/daysWithPlaces");
  },
  getDay(day) {
    return apiClient.get(
      "trips/" + day.tripId + "/days/" + day.id
    );
  },
  addDay(day) {
    return apiClient.post(
      "trips/" + day.tripId + "/days",
      day
    );
  },
  updateDay(day) {
    return apiClient.put(
      "trips/" + day.tripId + "/days/" + day.id,
      day
    );
  },
  deleteDay(day) {
    return apiClient.delete(
      "trips/" + day.tripId + "/days/" + day.id
    );
  },
};
