import { createContext, useContext, useState, useEffect } from 'react';

const RequestContext = createContext();

export const useRequest = () => {
    const context = useContext(RequestContext);
    if (!context) {
        throw new Error('useRequest must be used within a RequestProvider');
    }
    return context;
};

// Ürün + renk kombinasyonundan benzersiz key oluştur
const getItemKey = (productId, selectedColors = []) => {
    const colorKey = selectedColors.length > 0 ? selectedColors.sort().join('|') : 'no-color';
    return `${productId}__${colorKey}`;
};

export const RequestProvider = ({ children }) => {
    const [items, setItems] = useState(() => {
        const saved = localStorage.getItem('eses3d-request-list');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('eses3d-request-list', JSON.stringify(items));
    }, [items]);

    // Listeye ürün ekle (aynı ürün farklı renklerle eklenebilir)
    const addItem = (product, quantity = 1, note = '', selectedColors = []) => {
        const key = getItemKey(product._id, selectedColors);

        setItems(prev => {
            const existingIndex = prev.findIndex(item => item._itemKey === key);

            if (existingIndex > -1) {
                // Aynı ürün + aynı renk zaten var, miktarı güncelle
                const updated = [...prev];
                updated[existingIndex].quantity += quantity;
                return updated;
            }

            // Yeni satır ekle
            return [...prev, {
                _itemKey: key,
                product,
                productName: product.name,
                quantity,
                note,
                selectedColors
            }];
        });
    };

    // Listeden ürün çıkar (key bazlı)
    const removeItem = (itemKey) => {
        setItems(prev => prev.filter(item => item._itemKey !== itemKey));
    };

    // Ürün miktarını güncelle (key bazlı)
    const updateQuantity = (itemKey, quantity) => {
        if (quantity < 1) return;
        setItems(prev => prev.map(item =>
            item._itemKey === itemKey
                ? { ...item, quantity }
                : item
        ));
    };

    // Ürün notunu güncelle (key bazlı)
    const updateNote = (itemKey, note) => {
        setItems(prev => prev.map(item =>
            item._itemKey === itemKey
                ? { ...item, note }
                : item
        ));
    };

    // Listeyi temizle
    const clearList = () => {
        setItems([]);
    };

    // Toplam ürün sayısı
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    // Belirli ürün + renk kombinasyonu listede mi?
    const isInList = (productId, selectedColors = []) => {
        const key = getItemKey(productId, selectedColors);
        return items.some(item => item._itemKey === key);
    };

    return (
        <RequestContext.Provider value={{
            items,
            addItem,
            removeItem,
            updateQuantity,
            updateNote,
            clearList,
            totalItems,
            isInList
        }}>
            {children}
        </RequestContext.Provider>
    );
};
