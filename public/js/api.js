/**
 * NetPolix API Client
 * Centralized HTTP client for all API calls
 */
const NetPolixAPI = {
  baseUrl: '/api',

  getToken() {
    return localStorage.getItem('netpolix_token');
  },

  getUser() {
    const user = localStorage.getItem('netpolix_user');
    return user ? JSON.parse(user) : null;
  },

  setSession(token, user) {
    localStorage.setItem('netpolix_token', token);
    localStorage.setItem('netpolix_user', JSON.stringify(user));
  },

  clearSession() {
    localStorage.removeItem('netpolix_token');
    localStorage.removeItem('netpolix_user');
  },

  isLoggedIn() {
    return !!this.getToken();
  },

  logout() {
    this.clearSession();
    window.location.href = '/login.html';
  },

  async request(method, endpoint, data = null, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      method,
      headers,
    };

    if (data && method !== 'GET') {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config);
      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          // Token expired or invalid
          if (response.status === 401 && !options.skipAuthRedirect) {
            this.clearSession();
            window.location.href = '/login.html';
            return;
          }
        }
        throw new Error(result.error || `Error ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error(`API Error [${method} ${endpoint}]:`, error);
      throw error;
    }
  },

  async get(endpoint) {
    return this.request('GET', endpoint);
  },

  async post(endpoint, data) {
    return this.request('POST', endpoint, data);
  },

  async put(endpoint, data) {
    return this.request('PUT', endpoint, data);
  },

  async delete(endpoint) {
    return this.request('DELETE', endpoint);
  },

  async uploadFile(endpoint, formData) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {};
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || `Error ${response.status}`);
      }
      return result;
    } catch (error) {
      console.error(`Upload Error [${endpoint}]:`, error);
      throw error;
    }
  },

  // Auth endpoints
  async login(email, password) {
    const result = await this.request('POST', '/auth/login', { email, password }, { skipAuthRedirect: true });
    if (result.token) {
      this.setSession(result.token, result.user);
    }
    return result;
  },

  async register(data) {
    const result = await this.request('POST', '/auth/register', data, { skipAuthRedirect: true });
    if (result.token) {
      this.setSession(result.token, result.user);
    }
    return result;
  },

  async getProfile() {
    return this.get('/auth/profile');
  }
};

// Make globally available
window.NetPolixAPI = NetPolixAPI;
