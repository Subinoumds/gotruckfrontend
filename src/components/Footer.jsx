import styles from '../styles/Connexion.module.css'

const Footer = () => {
    return (
        <div className={styles.footer} style={{ color: '#fffbf8' }}>
            <div className={styles.containerContainer}>
                <div className={styles.container195}>
                    <div className={styles.containerIcon15} style={{
                        height: '48px',
                        width: '264px',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <img src="/logo-footer.png" alt="GoTruck" style={{ height: '100%', width: 'auto' }} />
                    </div>
                    <div className={styles.container196}>
                        <div className={styles.container16}>
                            <div className={styles.heading2}>
                                <b className={styles.plusDe3500}>Plus de 3500 food trucks dans toute la france</b>
                            </div>
                        </div>
                        <div className={styles.container198}>
                            <div className={styles.container199}>
                                <div className={styles.container200}>
                                    <b className={styles.entreprise}>Entreprise</b>
                                </div>
                                <div className={styles.container201}>
                                    <div className={styles.linkNous}>Nous contacter</div>
                                </div>
                                <div className={styles.container202}>
                                    <div className={styles.linkNous}>Qui sommes-nous ?</div>
                                </div>
                                <div className={styles.container203}>
                                    <div className={styles.linkNous}>Devenir actionnaire</div>
                                </div>
                                <div className={styles.container203}>
                                    <div className={styles.linkNous}>On recrute !</div>
                                </div>
                                <div className={styles.container201}>
                                    <div className={styles.linkNous}>Mentions légales</div>
                                </div>
                                <div className={styles.container201}>
                                    <div className={styles.linkNous}>Gestion des cookies</div>
                                </div>
                            </div>
                            <div className={styles.container199}>
                                <div className={styles.container208}>
                                    <b className={styles.entreprise}>FOOD TRUCKERS</b>
                                </div>
                                <div className={styles.container201}>
                                    <div className={styles.linkNous}>GoTruck Academy</div>
                                </div>
                                <div className={styles.container201}>
                                    <div className={styles.linkNous}>L'espace pro</div>
                                </div>
                                <div className={styles.container201}>
                                    <div className={styles.linkNous}>Inscription Food Truck</div>
                                </div>
                                <div className={styles.container201}>
                                    <div className={styles.linkNous}>Guide des emballages</div>
                                </div>
                                <div className={styles.container201}>
                                    <div className={styles.linkNous}>Hygiène et sécurité</div>
                                </div>
                                <div className={styles.container201}>
                                    <div className={styles.linkNous}>FAQ Restaurateurs</div>
                                </div>
                            </div>
                            <div className={styles.container199}>
                                <div className={styles.container200}>
                                    <b className={styles.entreprise}>EVENEMENTS</b>
                                </div>
                                <div className={styles.container201}>
                                    <div className={styles.linkNous}>Privatiser un truck</div>
                                </div>
                                <div className={styles.container201}>
                                    <div className={styles.linkNous}>GoTruck Festival</div>
                                </div>
                                <div className={styles.container201}>
                                    <div className={styles.linkNous}>Agenda</div>
                                </div>
                            </div>
                            <div className={styles.container221}>
                                <div className={styles.container222}>
                                    <b className={styles.entreprise}>AIDE</b>
                                </div>
                                <div className={styles.container223}>
                                    <div className={styles.linkNous}>Centre d'aide</div>
                                </div>
                                <div className={styles.container223}>
                                    <div className={styles.linkNous}>Contact support</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.background18}>
                    <div className={styles.nosRseauxSociaux}>Nos réseaux sociaux</div>
                    <div className={styles.rs}>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <img src="/facebook.svg" alt="Facebook" className={styles.svgIcon43} style={{ width: '32px', height: '32px' }} />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <img src="/insta.svg" alt="Instagram" className={styles.svgIcon43} style={{ width: '32px', height: '32px' }} />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                            <img src="/linkedin.svg" alt="LinkedIn" className={styles.groupIcon} style={{ width: '32px', height: '32px' }} />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer
