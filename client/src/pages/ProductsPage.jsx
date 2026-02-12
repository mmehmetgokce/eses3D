import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import { getProducts, getCategories } from '../services/api';

const ProductsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('kategori') || '');

    useEffect(() => {
        fetchData();
    }, [selectedCategory, searchTerm]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [productsRes, categoriesRes] = await Promise.all([
                getProducts({ category: selectedCategory, search: searchTerm }),
                getCategories()
            ]);
            setProducts(productsRes.data.data);
            setCategories(categoriesRes.data.data);
        } catch (error) {
            console.error('Veri yüklenirken hata:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        if (categoryId) {
            setSearchParams({ kategori: categoryId });
        } else {
            setSearchParams({});
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // searchTerm zaten state'te, useEffect tetiklenecek
    };

    const clearFilters = () => {
        setSelectedCategory('');
        setSearchTerm('');
        setSearchParams({});
    };

    const hasActiveFilters = selectedCategory || searchTerm;

    return (
        <div className="min-h-screen py-8 animate-fade-in">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Ürünler</h1>
                    <p className="text-dark-400">
                        3D baskı ürünlerimizi inceleyin ve beğendiklerinizi talep listenize ekleyin.
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col gap-4 mb-8">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="w-full">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Ürün ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input"
                            />
                        </div>
                    </form>

                    {/* Category Filter - Desktop ve Mobile için ortak */}
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            onClick={() => handleCategoryChange('')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!selectedCategory
                                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                                : 'bg-light-200 dark:bg-dark-700 text-light-700 dark:text-dark-300 hover:bg-light-300 dark:hover:bg-dark-600'
                                }`}
                        >
                            Tümü
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat._id}
                                onClick={() => handleCategoryChange(cat._id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat._id
                                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                                    : 'bg-light-200 dark:bg-dark-700 text-light-700 dark:text-dark-300 hover:bg-light-300 dark:hover:bg-dark-600'
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>



                {/* Active Filters */}
                {hasActiveFilters && (
                    <div className="flex items-center space-x-2 mb-6">
                        <span className="text-dark-400 text-sm">Aktif Filtreler:</span>
                        {selectedCategory && (
                            <span className="bg-primary-500/20 text-primary-400 px-3 py-1 rounded-full text-sm">
                                {categories.find(c => c._id === selectedCategory)?.name}
                            </span>
                        )}
                        {searchTerm && (
                            <span className="bg-primary-500/20 text-primary-400 px-3 py-1 rounded-full text-sm">
                                "{searchTerm}"
                            </span>
                        )}
                        <button
                            onClick={clearFilters}
                            className="text-dark-400 hover:text-primary-400 text-sm underline"
                        >
                            Temizle
                        </button>
                    </div>
                )}

                {/* Products Grid */}
                {loading ? (
                    <Loading text="Ürünler yükleniyor..." />
                ) : products.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-dark-400 text-lg mb-4">
                            {hasActiveFilters
                                ? 'Arama kriterlerinize uygun ürün bulunamadı.'
                                : 'Henüz ürün bulunmuyor.'}
                        </p>
                        {hasActiveFilters && (
                            <button onClick={clearFilters} className="btn-secondary">
                                Filtreleri Temizle
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <p className="text-dark-500 text-sm mb-4">
                            {products.length} ürün bulundu
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProductsPage;
