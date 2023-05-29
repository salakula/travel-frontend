import apiClient from "./services";

export default {
  getPlaces() {
    return apiClient.get("places");
  },
  getPlace(id) {
    return apiClient.get("places/" + id);
  },
  addPlace(place) {
    return apiClient.post("places", place);
  },
  updatePlace(place) {
    return apiClient.put("places/" + place.id, place);
  },
  deletePlace(placeId) {
    return apiClient.delete("places/" + placeId);
  },
};
