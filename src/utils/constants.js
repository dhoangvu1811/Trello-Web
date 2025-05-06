/* có thể dùng import.meta.env của vite */

let apiRoot = ''
if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:8017'
}
if (process.env.BUILD_MODE === 'production') {
  apiRoot = 'https://trello-api-5q6o.onrender.com'
}
export const API_ROOT = apiRoot
