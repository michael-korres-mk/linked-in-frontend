import axios from '@axios'
import { defineStore } from 'pinia'

const getCacheKey = (endpoint, params) => {
  let hash = endpoint

  if (typeof params === 'object') {
    Object.keys(params).forEach(prop => {
      hash += `__${prop}_${params[prop]}`
    })
  }

  return hash
}

const getters = {
  isAuthenticated: state => state.userData.token != '',
  userRights: state => {
    return state.userData?.authorities
      ? state.userData.authorities.map(right => right.authority)
      : []
  },
}

const actions = {
  cached(key) {
    if (this.isCacheValid(key)) {
      return this.cache.items[key].data
    }

    return undefined
  },
  isCacheValid(key) {
    const item = this.cache.items[key]
    const timestamp = Date.now()

    return item && this.cache.validFor > timestamp - item.timestamp
  },
  clearCache() {
    this.cache.items = {}
  },
  jwtLogin(token) {
    return new Promise((resolve, reject) => {
      
      axios
        .get(`jwt/login?token=${token}`)
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
  },
  jwtLoginCredentials(email, password) {
    return new Promise((resolve, reject) => {

        axios
            .get(`jwt/login?email=${email}&password=${password}`)
            .then(response => resolve(response))
            .catch(error => reject(error))
    })
  },
  uploadFile(file, name) {
    const lastDot = name.lastIndexOf('.')
    const formData = new FormData()

    formData.append('file', file)
    formData.append('type', name.substring(lastDot + 1))
    formData.append('name', name)

    return new Promise((resolve, reject) => {
      axios
        .post('files/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(response => resolve(response.data))
        .catch(error => reject(error))
    })
  },
  axiosGet(payload) {
    const queryParams = payload.params
    const endpoint = payload.url
    const cacheLocally = payload.cache
    const key = getCacheKey(endpoint, queryParams)

    return new Promise((resolve, reject) => {
      if (cacheLocally && this.isCacheValid(key)) {
        return resolve(this.cached(key))
      }
      axios
        .get(endpoint, {
          params: queryParams,
          paramsSerializer: {
            indexes: null,
          },
        })
        .then(response => {
          if (cacheLocally) {
            this.cache.items[key] = {
              timestamp: Date.now(),
              data: response?.data || [],
            }
          }

          return resolve(response.data)
        })
        .catch(error => reject(error))
    })
  },
  fetchList(endpoint, queryParams) {
    return this.axiosGet({
      params: queryParams,
      url: `${endpoint}/list`,
      cache: false,
    })
  },
  fetchCachedList(endpoint, queryParams) {
    return this.axiosGet({
      params: queryParams,
      url: `${endpoint}/list`,
      cache: true,
    })
  },
  async fetchFile(fileId) {
    return axios.get(`files/${fileId}`, { responseType: 'blob' })
  },
  getSearchItems(endpoint, parameter, val, prependPath) {
    return this.axiosGet(
      {
        url: `${endpoint}?${parameter}=${val}`,
        cache: false,
      },
      prependPath,
    )
  },
  roles() {
    return this.fetchCachedList('users/roles')
  },
  rights(subsystem) {
    return this.fetchCachedList('roles/rights', { subsystem })
  },
  fetchChatContacts() {
    return this.fetchCachedList('users/contacts')
  },
  fetchRecentChats() {
    return this.fetchCachedList('chats/recent')
  },
  fetchChatHistory(recipientId) {
   return this.axiosGet({ url: `chats/history/${recipientId}` })
  },
  fetchUserRequests() {
    return this.fetchList('users/connection-requests')
  },

}

export const useSessionStore = defineStore('session', {
  state: () => {
    const sessionUser = sessionStorage.getItem('userData')

    const userData = sessionUser
      ? JSON.parse(sessionUser)
      : {
        type: '',
        token: '',
        firstName: '',
        lastName: '',
        organization: '',
        afm: '',
        market: null,
        educationLevel: 'FIRST_EDUCATION_LEVEL',
      }

    return {
      cache: {
        items: {},
        validFor: 1000 * 60 * 10, // 10 minutes
      },
      userData,
    }
  },
  getters,
  actions,
})
