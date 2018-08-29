export function getUser(data) {
  return {
    type : "GET_USER",
    data : data
  }
}
export function getAnimals(data) {
  return {
    type : "GET_ANIMAL",
    data : data
  }
}
export function getSelectedHeaders(data) {
  return {
    type: "GET_HEADERS",
    data : data
  }
}
