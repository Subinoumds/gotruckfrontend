import styles from '../styles/Header.module.css'

const Header = ({ onMenuClick }) => {
  return (
    <div className={styles.header}>
      <div className={styles.container}>
        <div className={styles.container2}>
          <div className={styles.container3}>
            <div className={styles.menuBurger} onClick={onMenuClick}>
              <img src="/menu-burger.svg" alt="Menu" className={styles.calque1Icon} style={{ width: '70px', height: '60px', cursor: 'pointer' }} />
            </div>
            <img src="/logo-header.png" alt="GoTruck" className={styles.logoTitreGotruck1Icon} style={{ height: '20px', width: 'auto' }} />
          </div>
          <div className={styles.containerParent}>
            <div className={styles.container4}>
              <div className={styles.container5}>
                <div className={styles.container6}>
                  <div className={styles.button}>
                    <div className={styles.container7}>
                      <b className={styles.fr}>FR</b>
                    </div>
                  </div>
                </div>
                <div className={styles.container8}>
                  <div className={styles.button2}>
                    <div className={styles.container7}>
                      <b className={styles.fr}>EUR</b>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.containerIcon} style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: '#85031f',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fffbf8',
              fontSize: '18px',
              fontWeight: 600
            }}>
              U
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
