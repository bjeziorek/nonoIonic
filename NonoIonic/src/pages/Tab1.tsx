import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import NonoGame from '../NonoGame/NonoGame'
import './Tab1.css';

const Tab1: React.FC = () => {
  return (
    <IonPage>
     <NonoGame></NonoGame>
     
    </IonPage>
  );
};

export default Tab1;
