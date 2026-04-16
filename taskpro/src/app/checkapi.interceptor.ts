import { HttpInterceptorFn } from '@angular/common/http';

export const checkapiInterceptor: HttpInterceptorFn = (req, next) => {

  const tokenGet = localStorage.getItem("token");
  console.log("token triggered",tokenGet)

  if (tokenGet) {

    const cloneNode = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${tokenGet}`
      }

    });
    

    return next(cloneNode);
  }




  return next(req);
};
