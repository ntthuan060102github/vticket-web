import axios from 'axios';
import { useEffect, useRef } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

function AxiosProvider()
{
    const interceptorId = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        interceptorId.current = axios.interceptors.response.use((response) => {
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
                  console.log(data.message);
                  break;
                default:
                  return response
              }
            }
          
            return response;
          }, 
          (error) => {
            console.error('Có lỗi xảy ra:', error);
            return Promise.reject(error);
          }
        );

    return () => {
      axios.interceptors.response.eject(interceptorId.current);
    };
  }, []);

  return <Outlet />;
}

export default AxiosProvider;
