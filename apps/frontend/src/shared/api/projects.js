import { apiClient } from './client.js'

export function getProjects() {
  return apiClient.get('/api/projects')
}

export function createProject(payload) {
  return apiClient.post('/api/createProject', payload)
}
