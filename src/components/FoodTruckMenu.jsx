import styles from '../styles/FoodTruckMenu.module.css';

const FoodTruckMenu = ({ foodtruck }) => {
    const hasMenuText = foodtruck.menu && foodtruck.menu.length > 0;
    const hasMenuPhotos = foodtruck.menu_photos && foodtruck.menu_photos.length > 0;

    if (!hasMenuText && !hasMenuPhotos) {
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

                {hasMenuText && (
                    <div style={{ width: '100%', marginBottom: '20px', whiteSpace: 'pre-wrap' }}>
                        {foodtruck.menu}
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
