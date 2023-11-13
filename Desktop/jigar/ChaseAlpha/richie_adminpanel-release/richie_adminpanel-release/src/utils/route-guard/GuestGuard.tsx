import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// project import
import config from 'config';
import useAuth from 'hooks/useAuth';

// types
import { GuardProps } from 'types/auth';

// ==============================|| GUEST GUARD ||============================== //

const GuestGuard = ({ children }: GuardProps) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  let path = config.defaultPath;

  useEffect(() => {
    if (isLoggedIn) {
      if (localStorage.getItem('permission')) {
        let permission = JSON.parse(localStorage.getItem('permission') || '');

        if (permission.length === 0) {
          path = './';
        }
        if (permission.map((x: any) => x.label).includes('Research')) {
          path = './advice';
        }
        if (permission.map((x: any) => x.label).includes('Advisory Admin')) {
          path = './advisory-master';
        }
        if (permission.map((x: any) => x.label).includes('Learn Module Admin')) {
          path = './special-programs';
        }
        if (permission.map((x: any) => x.label).includes('Accounts')) {
          path = './orders';
        }
        if (permission.map((x: any) => x.label).includes('Sales')) {
          path = './webinar-list';
        }

        if (permission.map((x: any) => x.label).includes('Support')) {
          path = './risk-profile';
        }
      }
      navigate(path, { replace: true });
    }
  }, [isLoggedIn, navigate]);

  return children;
};

export default GuestGuard;
