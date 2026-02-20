import { HttpInterceptorFn } from '@angular/common/http';
import { LoginRegisterResponse } from '../models/LoginRegisterResponse.model';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storedData = localStorage.getItem('user_data');
  const userData: LoginRegisterResponse | null = storedData ? JSON.parse(storedData) : null;

  if (userData?.token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${userData.token}`
      }
    });
    return next(cloned);
  }

  return next(req);
};