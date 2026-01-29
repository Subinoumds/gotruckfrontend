import React from 'react';
import styles from '../styles/FoodTruckPayment.module.css';

const FoodTruckPayment = ({ foodtruck }) => {
    // If we have dynamic data, use it. Otherwise, if it's strictly empty, show fallback.
    // However, the user request says: "si y'a pas d'info, affiche 'Pas d'informations pour le moment'".
    // BUT the snippet they gave has HARDCODED values. 
    // I will try to use the dynamic data `moyens_paiement` if available.
    // If the array is valid and has items, I map them.
    // If not, I show the fallback message.

    // Note: The user snippet had hardcoded values, but the instructions were:
    // "regarde si ça existe dans la bdd aussi, si c'est pas le cas, créé un champ moyen de paiement, et on affichera les infos venant de la bdd"

    const hasPaymentMethods = foodtruck.moyens_paiement && Array.isArray(foodtruck.moyens_paiement) && foodtruck.moyens_paiement.length > 0;

    if (!hasPaymentMethods) {
        return (
            <div className={styles.pageFoodTruckPayment}>
                <div className={styles.background}>
                    <div className={styles.textWrapper}>
                        <div className={styles.text}>
                            <div className={styles.walletParent}>
                                <img className={styles.walletIcon} alt="Wallet" src="/wallet.svg" />
                                <b className={styles.moyensDePaiement}>Moyens de paiement acceptés</b>
                            </div>
                            <div style={{ padding: '20px 0', color: '#0f0f0f', fontSize: '16px' }}>
                                Pas d'informations pour le moment
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageFoodTruckPayment}>
            <div className={styles.background}>
                <div className={styles.textWrapper}>
                    <div className={styles.text}>
                        <div className={styles.walletParent}>
                            <img className={styles.walletIcon} alt="Wallet" src="/wallet.svg" />
                            <b className={styles.moyensDePaiement}>Moyens de paiement acceptés</b>
                        </div>
                        <div className={styles.espceCarteBancaireContainer}>
                            <ul className={styles.espceCarteBancaireTicketR}>
                                {foodtruck.moyens_paiement.map((method, index) => (
                                    <li key={index} className={styles.espce}>{method}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FoodTruckPayment;
