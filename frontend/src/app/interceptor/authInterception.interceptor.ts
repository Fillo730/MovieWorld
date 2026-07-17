//Angular
import { HttpInterceptorFn } from '@angular/common/http';

//Services
import { StorageService } from '../services/storage.service';

//Models
import { LoginRegisterResponse } from '../models/LoginRegisterResponse.model';

//Constants
import { STORAGE_KEYS } from '../constants/storageKeys';
import { API_BASE_URL } from '../constants/app.config';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storageService = inject(StorageService);
  if (!req.url.startsWith(API_BASE_URL)) {
    return next(req);
  }

  const storedData = storageService.getItem<LoginRegisterResponse>(STORAGE_KEYS.USER_DATA);

  if (storedData?.token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${storedData.token}`
      }
    });
    return next(cloned);
  }

  return next(req);
};