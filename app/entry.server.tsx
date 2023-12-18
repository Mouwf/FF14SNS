import handleRequestDevelopment from './entry.server.dev';
import handleRequestProduction from './entry.server.netlify';

let handleRequest;

if (process.env.NODE_ENV === 'development') {
    console.log('Running in development mode');
    handleRequest = handleRequestDevelopment;
} else {
    console.log('Running in production mode');
    handleRequest = handleRequestProduction;
}

export default handleRequest;