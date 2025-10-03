// Configuration for different environments
const config = {
  development: {
    baseUrl: 'http://localhost:5000',
    apiUrl: 'http://localhost:5000'
  },
  production: {
    baseUrl: 'https://todo-m13aqj2pn-yc-directorys-projects-c68fc445.vercel.app',
    apiUrl: 'https://todo-m13aqj2pn-yc-directorys-projects-c68fc445.vercel.app'
  }
};

const environment = process.env.NODE_ENV || 'development';
const currentConfig = config[environment];

export default currentConfig;
