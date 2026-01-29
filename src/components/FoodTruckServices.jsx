import styles from '../styles/FoodTruckServices.module.css';

const FoodTruckServices = ({ foodtruck }) => {
    return (
        <div className={styles.pageFoodTruckServices}>
            <div className={styles.background}>
                <div className={styles.textParent}>
                    <div className={styles.text}>
                        <div className={styles.mapPinCheckParent}>
                            <img className={styles.mapPinCheckIcon} src="/map-pin-check.svg" alt="" />
                            <b className={styles.emplacementsEnSemaine}>Emplacements en semaine</b>
                        </div>
                        <div className={styles.beniBurritosParcourtContainer}>
                            <p className={styles.beniBurritosParcourt}>
                                {foodtruck.nom} parcourt les communes chaque semaine pour vous rapprocher de la meilleure street food.
                                Du parking de votre supermarché à la place du village, retrouvez notre camion à différents emplacements selon les jours.
                            </p>
                            <p className={styles.beniBurritosParcourt}>&nbsp;</p>
                            <ul className={styles.clickCollectSurPlaceEm}>
                                <li className={styles.clickCollect}>{`Click & Collect`}</li>
                                <li className={styles.clickCollect}>Sur place</li>
                                <li>À emporter</li>
                            </ul>
                        </div>
                    </div>
                    <div className={styles.text}>
                        <div className={styles.mapPinCheckParent}>
                            {/* Using same icon or calendar if available, user code used mapPinCheckIcon class for both but logic suggests maybe calendar or star */}
                            <img className={styles.mapPinCheckIcon} src="/party-popper.svg" alt="" />
                            <b className={styles.privatisationVnements}>{`Privatisation & évènements`}</b>
                        </div>
                        <div className={styles.beniBurritosParcourtContainer}>
                            <span>
                                Vous organisez un événement professionnel, un anniversaire, un mariage, ou une soirée entre amis ?
                                {foodtruck.nom} peut vous proposer une prestation clés en main avec notre food truck.
                                <br />
                                Nous pouvons nous adapter à vos besoins : nombre de convives, budget, date et lieu de votre choix.
                                Notre équipe gère le service complet pour que vous profitiez pleinement de votre événement.
                                <br />
                            </span>
                            <b>Contactez-nous</b>
                            <span> directement pour discuter de votre projet et obtenir un devis personnalisé.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FoodTruckServices;
