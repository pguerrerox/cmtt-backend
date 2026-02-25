import { apiClient } from './client.js'

export function getManagersPublic() {
  return apiClient.get('/api/managers')
}

export function getManagersAdmin() {
  return apiClient.get('/api/admin/managers')
}

export function createManager(payload) {
  return apiClient.post('/api/admin/createManager', payload)
}

export function updateManager(id, payload) {
  return apiClient.patch(`/api/admin/updateManager/${id}`, payload)
}

export function deleteManager(id) {
  return apiClient.delete(`/api/admin/deleteManager/${id}`)
}
