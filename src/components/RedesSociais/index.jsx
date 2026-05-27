import Instagram from '../../assets/img/instagram-icon.png'
import Tiktok from '../../assets/img/tiktok-icon.png'
import './index.css'
const RedesSociais = () => {
    return (
        <div className="container-redes">
            <img src={Instagram} alt="Instagram" />
            <img src={Tiktok} alt="TikTok" />
        </div>
    )
}

export default RedesSociais