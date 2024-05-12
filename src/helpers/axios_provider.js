import axios from 'axios';
import { useEffect, useRef } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

function AxiosProvider() {
  const requestInterceptorId = useRef(null);
  const responseInterceptorId = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Thiết lập interceptor cho các yêu cầu
    requestInterceptorId.current = axios.interceptors.request.use((config) => {
      // Thêm header vào config của yêu cầu
      const accessToken = localStorage.getItem('access');
      if (accessToken) {
        config.headers['Authorization'] = localStorage.getItem('access');
      }
      return config;
    }, (error) => {
      return Promise.reject(error);
    });

    // Thiết lập interceptor cho các phản hồi
    responseInterceptorId.current = axios.interceptors.response.use(
      (response) => {
        const { status, data } = response;
        if (status === 200 && data) {
          const customStatus = data.status;
          switch (customStatus) {
            case 1:
              return response;
            case 7:
              navigate(data?.data?.target);
              break;
            case 3:
            case 0:
            case 2:
            case 4:
            case 5:
            case 6:
              return response;
            default:
              return response;
          }
        }
        return response;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Dỡ bỏ interceptor khi component bị unmount
    return () => {
      axios.interceptors.request.eject(requestInterceptorId.current);
      axios.interceptors.response.eject(responseInterceptorId.current);
    };
  }, [navigate]);

  return <Outlet />;
}

export default AxiosProvider;
