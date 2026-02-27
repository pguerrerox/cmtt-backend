import { apiClient } from './client.js'

export function getProjectEngineers() {
  return apiClient.get('/api/projecteng')
}

export function getProjectEngineerById(projectEngineerId) {
  return apiClient.get(`/api/projecteng/${projectEngineerId}`)
}

export function createProjectEngineer(payload) {
  return apiClient.post('/api/admin/projecteng', payload)
}

export function updateProjectEngineer(projectEngineerId, payload) {
  return apiClient.patch(`/api/admin/projecteng/${projectEngineerId}`, payload)
}

export function deleteProjectEngineer(projectEngineerId) {
  return apiClient.delete(`/api/admin/projecteng/${projectEngineerId}`)
}
