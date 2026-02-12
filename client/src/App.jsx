import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { RequestProvider } from './context/RequestContext';
import { ThemeProvider } from './context/ThemeContext';

// Layout
import Layout from './components/Layout';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import RequestListPage from './pages/RequestListPage';
import RequestSuccessPage from './pages/RequestSuccessPage';
import CustomDesignPage from './pages/CustomDesignPage';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminRequests from './pages/admin/AdminRequests';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';

function App() {
    return (
        <ThemeProvider>
            <RequestProvider>
                <Router>
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 3000,
                            className: 'dark:bg-dark-800 dark:text-white dark:border-dark-700',
                            style: {
                                background: '#fff',
                                color: '#171717',
                                border: '1px solid #e5e5e5'
                            },
                            success: {
                                iconTheme: {
                                    primary: '#10b981',
                                    secondary: '#fff'
                                }
                            },
                            error: {
                                iconTheme: {
                                    primary: '#ef4444',
                                    secondary: '#fff'
                                }
                            }
                        }}
                    />
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Layout />}>
                            <Route index element={<HomePage />} />
                            <Route path="urunler" element={<ProductsPage />} />
                            <Route path="urunler/:id" element={<ProductDetailPage />} />
                            <Route path="talep-listem" element={<RequestListPage />} />
                            <Route path="talep-basarili/:requestId" element={<RequestSuccessPage />} />
                            <Route path="ozel-tasarim" element={<CustomDesignPage />} />
                        </Route>

                        {/* Admin Routes */}
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute>
                                    <AdminLayout />
                                </ProtectedRoute>
                            }
                        >
                            <Route index element={<AdminDashboard />} />
                            <Route path="urunler" element={<AdminProducts />} />
                            <Route path="kategoriler" element={<AdminCategories />} />
                            <Route path="talepler" element={<AdminRequests />} />
                        </Route>
                    </Routes>
                </Router>
            </RequestProvider>
        </ThemeProvider>
    );
}

export default App;

