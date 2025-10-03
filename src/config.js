// Configuration for different environments
const config = {
  development: {
    baseUrl: 'http://localhost:5000',
    apiUrl: 'http://localhost:5000'
  },
  production: {
    baseUrl: 'https://todo-app-xgze.onrender.com/',
    apiUrl: 'https://todo-app-xgze.onrender.com/'
  }
};

const environment = process.env.NODE_ENV || 'development';
const currentConfig = config[environment];

export default currentConfig;
