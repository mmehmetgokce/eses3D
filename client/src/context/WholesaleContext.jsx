import { createContext, useContext, useState, useEffect } from 'react';

const WholesaleContext = createContext();

export const useWholesale = () => {
    const context = useContext(WholesaleContext);
    if (!context) {
        throw new Error('useWholesale must be used within a WholesaleProvider');
    }
    return context;
};

// Kademe tablosu
const TIERS = [
    { min: 50, discount: 7.5 },
    { min: 60, discount: 15 },
    { min: 70, discount: 22.5 },
    { min: 80, discount: 30 },
    { min: 90, discount: 37.5 },
    { min: 100, discount: 45 }
];

export const getTier = (totalQty) => {
    for (let i = TIERS.length - 1; i >= 0; i--) {
        if (totalQty >= TIERS[i].min) return TIERS[i];
    }
    return null;
};

export const getNextTier = (totalQty) => {
    for (let i = 0; i < TIERS.length; i++) {
        if (totalQty < TIERS[i].min) return TIERS[i];
    }
    return null;
};

export { TIERS };

export const WholesaleProvider = ({ children }) => {
    const [items, setItems] = useState(() => {
        const saved = localStorage.getItem('eses3d-wholesale-list');
        return saved ? JSON.parse(saved) : [];
    });
    const [lockedCategoryId, setLockedCategoryId] = useState(() => {
        const saved = localStorage.getItem('eses3d-wholesale-category');
        return saved || null;
    });

    useEffect(() => {
        localStorage.setItem('eses3d-wholesale-list', JSON.stringify(items));
        if (items.length === 0) {
            setLockedCategoryId(null);
            localStorage.removeItem('eses3d-wholesale-category');
        }
    }, [items]);

    useEffect(() => {
        if (lockedCategoryId) {
            localStorage.setItem('eses3d-wholesale-category', lockedCategoryId);
        }
    }, [lockedCategoryId]);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const currentTier = getTier(totalItems);
    const nextTier = getNextTier(totalItems);
    const discountPercent = currentTier ? currentTier.discount : 0;

    // Ürün ekle veya adedini artır
    const addItem = (product, categoryId) => {
        // Kategori kilidi
        if (lockedCategoryId && lockedCategoryId !== categoryId) {
            return false; // farklı kategori
        }

        setItems(prev => {
            const existing = prev.findIndex(item => item.productId === product._id);
            if (existing > -1) {
                const updated = [...prev];
                updated[existing].quantity += 1;
                return updated;
            }
            return [...prev, {
                productId: product._id,
                productName: product.name,
                price: product.price || 0,
                image: product.images?.[0]?.url || '',
                quantity: 1
            }];
        });

        if (!lockedCategoryId) {
            setLockedCategoryId(categoryId);
        }
        return true;
    };

    // Adet güncelle
    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) {
            removeItem(productId);
            return;
        }
        setItems(prev => prev.map(item =>
            item.productId === productId
                ? { ...item, quantity }
                : item
        ));
    };

    // Ürün sil
    const removeItem = (productId) => {
        setItems(prev => {
            const updated = prev.filter(item => item.productId !== productId);
            return updated;
        });
    };

    // Listeyi temizle
    const clearList = () => {
        setItems([]);
        setLockedCategoryId(null);
        localStorage.removeItem('eses3d-wholesale-category');
    };

    // Toplam fiyat (indirimli)
    const calculateTotal = () => {
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const discount = subtotal * (discountPercent / 100);
        return { subtotal, discount, total: subtotal - discount };
    };

    return (
        <WholesaleContext.Provider value={{
            items,
            addItem,
            removeItem,
            updateQuantity,
            clearList,
            totalItems,
            currentTier,
            nextTier,
            discountPercent,
            lockedCategoryId,
            calculateTotal
        }}>
            {children}
        </WholesaleContext.Provider>
    );
};
