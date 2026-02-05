import styles from '../styles/FoodTruckMenu.module.css';

const FoodTruckMenu = ({ foodtruck }) => {
    const hasMenuText = foodtruck.menu && foodtruck.menu.length > 0;
    const hasMenuPhotos = foodtruck.menu_photos && foodtruck.menu_photos.length > 0;

    // Parse menu if it's a JSON string
    let menuItems = null;
    let menuText = null;
    let hasMenuContent = false;

    if (foodtruck.menu) {
        if (typeof foodtruck.menu === 'string' && foodtruck.menu.trim().startsWith('[')) {
            try {
                menuItems = JSON.parse(foodtruck.menu);
                hasMenuContent = true;
            } catch (e) {
                console.error('Error parsing menu JSON:', e);
                menuText = foodtruck.menu;
                hasMenuContent = true;
            }
        } else if (Array.isArray(foodtruck.menu)) {
            menuItems = foodtruck.menu;
            hasMenuContent = true;
        } else {
            menuText = foodtruck.menu;
            hasMenuContent = foodtruck.menu.length > 0;
        }
    }

    if (!hasMenuContent && !hasMenuPhotos) {
        return (
            <div className={styles.pageFoodTruckMenu}>
                <div className={styles.background}>
                    <div className={styles.menuWrapper}>
                        <b className={styles.menu}>Menu</b>
                    </div>
                    <div style={{ padding: '20px', textAlign: 'center', color: '#85031f' }}>
                        Pas de menus dispo pour l'instant
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageFoodTruckMenu}>
            <div className={styles.background}>
                <div className={styles.menuWrapper}>
                    <b className={styles.menu}>Menu</b>
                </div>

                {menuItems && (
                    <div style={{ width: '100%', marginBottom: '20px' }}>
                        {menuItems.map((item, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '8px 0',
                                borderBottom: '1px solid rgba(133, 3, 31, 0.1)'
                            }}>
                                <span style={{ fontWeight: '500', color: '#333' }}>{item.nom}</span>
                                <span style={{ color: '#85031f', fontWeight: 'bold' }}>{item.prix}€</span>
                            </div>
                        ))}
                    </div>
                )}

                {menuText && (
                    <div style={{ width: '100%', marginBottom: '20px', whiteSpace: 'pre-wrap' }}>
                        {menuText}
                    </div>
                )}

                {hasMenuPhotos && (
                    <div className={styles.menuParent}>
                        {foodtruck.menu_photos.map((photo, index) => (
                            <div key={index} className={styles.menu2} style={{ backgroundImage: `url(${photo})` }} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FoodTruckMenu;
