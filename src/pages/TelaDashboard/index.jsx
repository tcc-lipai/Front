import Navbar from '../../components/Navbar/index';
import './index.css';
import { HeaderActions } from '../../components/infoEstrelas/index';
import { UserProfileDrawer } from '../../components/UserProfileDrawer/index'; 

const TelaDashboard = () => {
  return (
    <div className="Container">
      <main className="contentContainer">
        <h1 style={{ color: '#4a154b', margin: 0 }}>Dashboard</h1>
        <p>Se você está vendo isso, as rotas funcionam e a Navbar está no lugar certo.</p>
      </main>
    </div>
  );
};

export default TelaDashboard;