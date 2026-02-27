import { apiClient } from './client.js'

export function getFacilities() {
  return apiClient.get('/api/facilities')
}

export function getFacilityById(facilityId) {
  return apiClient.get(`/api/facilities/${facilityId}`)
}

export function createFacility(payload) {
  return apiClient.post('/api/facilities', payload)
}

export function updateFacility(facilityId, payload) {
  return apiClient.patch(`/api/facilities/${facilityId}`, payload)
}

export function deleteFacility(facilityId) {
  return apiClient.delete(`/api/facilities/${facilityId}`)
}
