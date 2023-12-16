import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Segment, Container } from 'semantic-ui-react';
import Home from './Home';
import UserProfile from './UserProfile';
import UserFile from './UserFile';
import { useAuth } from '../AuthContext';

function MainContent() {
    const [activeItem, setActiveItem] = useState('home');
    
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleItemClick = (e, { name }) => setActiveItem(name);
   
    const handleLogout = () => {
        logout();
        // Clear additional localStorage items
        localStorage.removeItem("userToken");
        localStorage.removeItem("uid");
        localStorage.removeItem("isAdmin");
        localStorage.removeItem('selectedUserId');
      
        // Use setTimeout to delay navigation slightly
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 100);
      };
      
      

    const renderContent = () => {
        switch (activeItem) {
            case 'home':
                return <Home />;
            case 'Profile':
                return <UserProfile />;
            case 'Files':
                return <UserFile />;
            default:
                return <div>Select a menu item</div>;
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f0f0f0' }}>
            <Segment inverted style={{ marginBottom: '0', borderRadius: '0', position: 'sticky', top: 0, zIndex: 100 }}>
                <Menu inverted pointing secondary>
                    <Menu.Item name='home' active={activeItem === 'home'} onClick={handleItemClick} />
                    <Menu.Item name='Profile' active={activeItem === 'Profile'} onClick={handleItemClick} />
                    <Menu.Item name='Files' active={activeItem === 'Files'} onClick={handleItemClick} />
                    <Menu.Item position='right' name='logout' onClick={handleLogout} />
                </Menu>
            </Segment>
            <Container style={{ flex: 1, padding: '0', display: 'flex', justifyContent: 'center', marginTop: '0' }}>
                <Segment style={{ width: '70%', border: '1px solid black', marginTop: '0', borderRadius: '0' }}>
                    {renderContent()}
                </Segment>
            </Container>
        </div>
    );
}

export default MainContent;
