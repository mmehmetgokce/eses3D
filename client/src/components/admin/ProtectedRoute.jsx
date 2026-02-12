import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('eses3d-admin-token');
        setIsAuthenticated(!!token);
    }, []);

    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen bg-dark-900 flex items-center justify-center">
                <div className="text-dark-400">Yükleniyor...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
