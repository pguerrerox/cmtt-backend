import { apiClient } from './client.js'

export function getProjects() {
  return apiClient.get('/api/projects')
}

export function getProjectsByManager(managerId) {
  return apiClient.get(`/api/projects/manager/${managerId}`)
}

export function getProjectByNumber(projectNumber) {
  return apiClient.get(`/api/projects/${projectNumber}`)
}

export function createProject(payload) {
  return apiClient.post('/api/createProject', payload)
}

export function modifyProject(projectNumber, payload) {
  return apiClient.patch(`/api/modifyProject/${projectNumber}`, payload)
}
