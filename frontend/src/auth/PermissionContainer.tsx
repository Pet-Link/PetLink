import { useNavigate } from 'react-router-dom';
import { useUserStore } from './Store';

interface PermissionContainerProps {
    children: React.ReactNode;
    roles: string;
}

export function PermissionContainer({ children, roles }: PermissionContainerProps) {
    const navigate = useNavigate();
    const userType = useUserStore.getState().userType;

  if (userType !== roles) {
    console.log("User type: " + userType + " does not have permission to access this page.");
    //navigate("/");
    //return null; 
  }

  return <>{children}</>;
}
