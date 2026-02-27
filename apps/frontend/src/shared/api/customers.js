import { apiClient } from './client.js'

export function getCustomers() {
  return apiClient.get('/api/customers')
}

export function getCustomerById(customerId) {
  return apiClient.get(`/api/customers/${customerId}`)
}

export function createCustomer(payload) {
  return apiClient.post('/api/customers', payload)
}

export function updateCustomer(customerId, payload) {
  return apiClient.patch(`/api/customers/${customerId}`, payload)
}

export function deleteCustomer(customerId) {
  return apiClient.delete(`/api/customers/${customerId}`)
}
