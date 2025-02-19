import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EmailVerification from './EmailVerification/EmailVerification';
import LoadingSpinner from './LoadingSpinner/LoadingSpinner';

const PrivateRoute = ({ children }) => {
    const { user, loading, isVerified } = useAuth();

    if (loading) {
        return (
            <div className="loading-container">
                <LoadingSpinner size="medium" />
                <p className="loading-text">Checking Authentication...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (!isVerified) {
        return <EmailVerification />;
    }

    return children;
};

export default PrivateRoute;
