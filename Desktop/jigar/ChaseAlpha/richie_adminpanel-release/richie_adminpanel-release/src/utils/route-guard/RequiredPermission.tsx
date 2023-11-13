import { Navigate } from 'react-router';
import { GuardProps } from 'types/auth';

const RequiredPermission = ({ children, level }: GuardProps) => {
  const UserLevel = localStorage.getItem('permission');
  if (UserLevel)
    if (UserLevel.includes(level)) {
      return children;
    } else {
      return (
        <div>
          <Navigate to="/"></Navigate>
        </div>
      );
    }
  else {
    return (
      <div>
        <Navigate to="/"></Navigate>
      </div>
    );
  }
};

export default RequiredPermission;
