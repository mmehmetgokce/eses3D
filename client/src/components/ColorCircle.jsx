// Sabit renk paleti - admin bu renklerden seçim yapar
export const COLOR_PALETTE = [
    { name: 'Siyah', hex: '#1a1a1a' },
    { name: 'Beyaz', hex: '#f5f5f5' },
    { name: 'Kırmızı', hex: '#ef4444' },
    { name: 'Mavi', hex: '#3b82f6' },
    { name: 'Yeşil', hex: '#22c55e' },
    { name: 'Sarı', hex: '#eab308' },
    { name: 'Turuncu', hex: '#f97316' },
    { name: 'Mor', hex: '#a855f7' },
    { name: 'Pembe', hex: '#ec4899' },
    { name: 'Gri', hex: '#9ca3af' },
    { name: 'Kahverengi', hex: '#a16207' },
    { name: 'Turkuaz', hex: '#06b6d4' },
];

// Renk adından hex değerine dönüştür
export const getColorHex = (colorName) => {
    const found = COLOR_PALETTE.find(c => c.name === colorName);
    return found ? found.hex : '#9ca3af';
};

/**
 * ColorCircle - Renk kombinasyonunu görsel daire olarak gösterir
 * 
 * @param {string[]} colors - Renk adları dizisi ["Siyah", "Kırmızı"]
 * @param {number} size - Daire boyutu (px) varsayılan 32
 * @param {boolean} selected - Seçili mi?
 * @param {function} onClick - Tıklama handler
 * @param {boolean} showLabel - Altında renk adı göstersin mi
 */
const ColorCircle = ({ colors = [], size = 32, selected = false, onClick, showLabel = false, className = '' }) => {
    if (!colors || colors.length === 0) return null;

    const hexColors = colors.map(c => getColorHex(c));
    const label = colors.join(' - ');
    const r = size / 2;

    // SVG ile split daire oluştur
    const renderCircle = () => {
        if (hexColors.length === 1) {
            return (
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    <circle cx={r} cy={r} r={r} fill={hexColors[0]} />
                </svg>
            );
        }

        if (hexColors.length === 2) {
            return (
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    <path d={`M ${r} 0 A ${r} ${r} 0 0 1 ${r} ${size} L ${r} ${r} Z`} fill={hexColors[0]} />
                    <path d={`M ${r} ${size} A ${r} ${r} 0 0 1 ${r} 0 L ${r} ${r} Z`} fill={hexColors[1]} />
                </svg>
            );
        }

        if (hexColors.length === 3) {
            // Üçe bölünmüş daire (120° her biri)
            const points = [0, 120, 240].map((angle, i) => {
                const startAngle = (angle - 90) * Math.PI / 180;
                const endAngle = (angle + 120 - 90) * Math.PI / 180;
                const x1 = r + r * Math.cos(startAngle);
                const y1 = r + r * Math.sin(startAngle);
                const x2 = r + r * Math.cos(endAngle);
                const y2 = r + r * Math.sin(endAngle);
                return { startX: x1, startY: y1, endX: x2, endY: y2, fill: hexColors[i] };
            });

            return (
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    {points.map((p, i) => {
                        const startAngle = ((i * 120) - 90) * Math.PI / 180;
                        const endAngle = (((i + 1) * 120) - 90) * Math.PI / 180;
                        const x1 = r + r * Math.cos(startAngle);
                        const y1 = r + r * Math.sin(startAngle);
                        const x2 = r + r * Math.cos(endAngle);
                        const y2 = r + r * Math.sin(endAngle);
                        return (
                            <path
                                key={i}
                                d={`M ${r} ${r} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`}
                                fill={p.fill}
                            />
                        );
                    })}
                </svg>
            );
        }

        if (hexColors.length === 4) {
            return (
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    {[0, 90, 180, 270].map((angle, i) => {
                        const startAngle = (angle - 90) * Math.PI / 180;
                        const endAngle = (angle + 90 - 90) * Math.PI / 180;
                        const x1 = r + r * Math.cos(startAngle);
                        const y1 = r + r * Math.sin(startAngle);
                        const x2 = r + r * Math.cos(endAngle);
                        const y2 = r + r * Math.sin(endAngle);
                        return (
                            <path
                                key={i}
                                d={`M ${r} ${r} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`}
                                fill={hexColors[i]}
                            />
                        );
                    })}
                </svg>
            );
        }

        return null;
    };

    return (
        <div className={`inline-flex flex-col items-center ${className}`}>
            <button
                type="button"
                onClick={onClick}
                title={label}
                className={`rounded-full transition-all duration-200 overflow-hidden flex-shrink-0 ${selected
                        ? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-white dark:ring-offset-dark-800 scale-110'
                        : onClick ? 'hover:scale-110 hover:ring-2 hover:ring-light-400 dark:hover:ring-dark-500 hover:ring-offset-1' : ''
                    } ${!onClick ? 'cursor-default' : 'cursor-pointer'}`}
                style={{ width: size, height: size }}
                disabled={!onClick}
            >
                {renderCircle()}
            </button>
            {showLabel && (
                <span className="text-xs text-light-500 dark:text-dark-400 mt-1 text-center max-w-[80px] truncate">
                    {label}
                </span>
            )}
        </div>
    );
};

export default ColorCircle;
