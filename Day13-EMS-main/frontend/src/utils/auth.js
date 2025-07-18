export const saveToken = (token) => localStorage.setItem('jwt', token);
export const getToken = () => localStorage.getItem('jwt');
export const clearToken = () => localStorage.removeItem('jwt');
