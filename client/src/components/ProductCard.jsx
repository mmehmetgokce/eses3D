import { Link } from 'react-router-dom';
import { Plus, Check } from 'lucide-react';
import { useRequest } from '../context/RequestContext';
import ColorCircle from './ColorCircle';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
    const { addItem, isInList } = useRequest();
    const inList = isInList(product._id);

    const handleAddToList = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!inList) {
            addItem(product);
            toast.success(`"${product.name}" talep listesine eklendi!`);
        }
    };

    const mainImage = product.images?.[0]?.url || '/placeholder.jpg';

    return (
        <Link
            to={`/urunler/${product._id}`}
            className="card card-hover group"
        >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden">
                <img
                    src={mainImage}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Category Badge */}
                {product.category && (
                    <span className="absolute top-3 left-3 bg-dark-900/80 backdrop-blur-sm text-xs px-3 py-1 rounded-full text-dark-200">
                        {product.category.name}
                    </span>
                )}

                {/* Add to List Button */}
                <button
                    onClick={handleAddToList}
                    className={`absolute bottom-3 right-3 p-3 rounded-full transition-all duration-300 ${inList
                        ? 'bg-green-500 text-white cursor-default'
                        : 'bg-primary-500 text-white hover:bg-primary-400 hover:scale-110'
                        }`}
                >
                    {inList ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </button>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-semibold text-light-900 dark:text-white group-hover:text-primary-500 transition-colors line-clamp-1">
                    {product.name}
                </h3>
                <p className="text-light-600 dark:text-dark-400 text-sm mt-1 line-clamp-2">
                    {product.description}
                </p>

                {product.standardSize && (
                    <p className="text-light-500 dark:text-dark-500 text-xs mt-2">
                        Standart Boyut: {product.standardSize}
                    </p>
                )}

                {/* Renk Seçenekleri */}
                {product.colorCombinations?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                        {product.colorCombinations.slice(0, 6).map((combo, i) => (
                            <ColorCircle key={i} colors={combo.colors} size={20} />
                        ))}
                        {product.colorCombinations.length > 6 && (
                            <span className="text-xs text-light-500 dark:text-dark-400 self-center">
                                +{product.colorCombinations.length - 6}
                            </span>
                        )}
                    </div>
                )}

                {/* Fiyat */}
                <div className="mt-3 pt-3 border-t border-light-200 dark:border-dark-700">
                    {product.price != null ? (
                        <span className="text-lg font-bold text-primary-500 dark:text-primary-400">
                            {product.price.toLocaleString('tr-TR')} ₺
                        </span>
                    ) : (
                        <span className="text-sm text-light-500 dark:text-dark-400 italic">
                            Fiyat Sorunuz
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
