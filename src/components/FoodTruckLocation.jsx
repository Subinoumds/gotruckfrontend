import React from 'react';
import styles from '../styles/FoodTruckLocation.module.css';

const FoodTruckLocation = ({ foodtruck }) => {
    // Parse horaires from database (assuming it's stored as JSON or text)
    const renderSchedule = () => {
        console.log('Horaires data:', foodtruck.horaires, typeof foodtruck.horaires);

        if (!foodtruck.horaires) {
            return (
                <div className={styles.noData}>
                    Les horaires ne sont pas encore renseignés par le Food Truck.
                </div>
            );
        }

        // If horaires is a JSON object with days
        try {
            let schedule;

            // Try to parse if it's a string
            if (typeof foodtruck.horaires === 'string') {
                // Check if it looks like JSON
                if (foodtruck.horaires.trim().startsWith('{') || foodtruck.horaires.trim().startsWith('[')) {
                    schedule = JSON.parse(foodtruck.horaires);
                } else {
                    // It's plain text, display as-is
                    return <div style={{ whiteSpace: 'pre-wrap' }}>{foodtruck.horaires}</div>;
                }
            } else if (typeof foodtruck.horaires === 'object') {
                schedule = foodtruck.horaires;
            } else {
                return <div>{String(foodtruck.horaires)}</div>;
            }

            // If it's an object, render as list
            if (schedule && typeof schedule === 'object' && !Array.isArray(schedule)) {
                const dayNames = {
                    lundi: 'Lundi',
                    mardi: 'Mardi',
                    mercredi: 'Mercredi',
                    jeudi: 'Jeudi',
                    vendredi: 'Vendredi',
                    samedi: 'Samedi',
                    dimanche: 'Dimanche'
                };

                return (
                    <ul className={styles.scheduleList}>
                        {Object.entries(schedule).map(([day, hours]) => (
                            <li key={day} className={styles.scheduleItem}>
                                {dayNames[day.toLowerCase()] || day} : {hours || 'Fermé'}
                            </li>
                        ))}
                    </ul>
                );
            }

            // Fallback
            return <div>{JSON.stringify(schedule)}</div>;
        } catch (e) {
            console.error('Error parsing horaires:', e);
            // If parsing fails, display as plain text
            return <div style={{ whiteSpace: 'pre-wrap' }}>{String(foodtruck.horaires)}</div>;
        }
    };

    const handleCopyAddress = () => {
        if (foodtruck.adresse) {
            navigator.clipboard.writeText(foodtruck.adresse);
            alert('Adresse copiée !');
        }
    };

    const handleCallTruck = () => {
        if (foodtruck.tel) {
            window.location.href = `tel:${foodtruck.tel}`;
        }
    };

    return (
        <div className={styles.pageFoodTruckLocation}>
            <div className={styles.background}>
                <div className={styles.frameParent}>
                    <div className={styles.frameGroup}>
                        <div className={styles.textWrapper}>
                            <div className={styles.text}>
                                <div className={styles.mapPinCheckParent}>
                                    <svg className={styles.mapPinCheckIcon} viewBox="0 0 24 24" fill="#ec6827">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                    </svg>
                                    <b className={styles.localisationEnTemps}>Localisation en temps réel</b>
                                </div>
                            </div>
                        </div>
                        <div className={styles.mapImageIcon}>
                            Carte non disponible (position en temps réel non activée)
                        </div>
                    </div>

                    <div className={styles.text2}>
                        <div className={styles.mapPinCheckParent}>
                            <svg className={styles.mapPinCheckIcon} viewBox="0 0 24 24" fill="#ec6827">
                                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                            </svg>
                            <b className={styles.horairesDouverture}>Horaires d'ouverture</b>
                        </div>
                        <div className={styles.scheduleContainer}>
                            <p className={styles.scheduleText}>
                                Les horaires sont renseignés par le Food Truck directement.
                            </p>
                            <p className={styles.scheduleText}>&nbsp;</p>
                            {renderSchedule()}
                        </div>
                    </div>
                </div>

                <div className={styles.text3}>
                    <div className={styles.currentLocationText}>
                        <span>Maintenant : </span>
                        <b className={styles.locationHighlight}>
                            {foodtruck.adresse || 'Position non disponible'}
                        </b>
                    </div>
                </div>

                <div className={styles.boutonParent}>
                    <button className={styles.bouton3} onClick={handleCopyAddress} disabled={!foodtruck.adresse}>
                        <div>Copier l'adresse</div>
                        <svg className={styles.heartIcon} fill="white" viewBox="0 0 24 24">
                            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                        </svg>
                    </button>
                    <button className={styles.bouton4} onClick={handleCallTruck} disabled={!foodtruck.tel}>
                        <div>Appeler le Food Truck</div>
                        <svg className={styles.heartIcon} fill="#85031f" viewBox="0 0 24 24">
                            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FoodTruckLocation;
