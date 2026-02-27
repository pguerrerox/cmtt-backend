import { apiClient } from './client.js'

export function getSalesManagers() {
  return apiClient.get('/api/salesmanagers')
}

export function getSalesManagerById(salesManagerId) {
  return apiClient.get(`/api/salesmanagers/${salesManagerId}`)
}

export function createSalesManager(payload) {
  return apiClient.post('/api/admin/salesmanagers', payload)
}

export function updateSalesManager(salesManagerId, payload) {
  return apiClient.patch(`/api/admin/salesmanagers/${salesManagerId}`, payload)
}

export function deleteSalesManager(salesManagerId) {
  return apiClient.delete(`/api/admin/salesmanagers/${salesManagerId}`)
}
