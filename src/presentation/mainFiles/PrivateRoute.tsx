import { Navigate, Route, useLocation } from 'react-router-dom';
import { saveLastRoute } from '../../application/Redux/slices/LastRouteSlice';
import { useAppDispatch } from '../../application/Redux/store/store';

/* eslint-disable react/jsx-no-useless-fragment */
const PrivateRoute: React.FC<{
  element: React.ReactNode;
}> = ({ element }) => {
  const tempVar = localStorage.getItem('userInfo') || 'false';
  const isAuthenticated = JSON.parse(tempVar);
  const dispatch = useAppDispatch();
  const location = useLocation();

  // Save the current location in state if user is not authenticated
  if (!isAuthenticated) {
    dispatch(saveLastRoute({ from: location }));
  }

  return isAuthenticated ? (
    <>{element}</>
  ) : (
    <Navigate to="/loginUsername" replace />
  );
};

export default PrivateRoute;
