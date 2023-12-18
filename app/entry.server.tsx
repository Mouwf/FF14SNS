import handleRequestDevelopment from './entry.server.dev';
import handleRequestProduction from './entry.server.netlify';

let handleRequest;

if (process.env.NODE_ENV === 'development') {
    handleRequest = handleRequestDevelopment;
} else {
    handleRequest = handleRequestProduction;
}

export default handleRequest;