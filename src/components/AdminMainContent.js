import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Segment, Container } from 'semantic-ui-react';
import AdminHome from './AdminHome';
import AdminUserList from './AdminUserList';
import AdminRegister from './AdminRegister';
import UserProfile from './UserProfile';
import UserFile from './UserFile';
import Home from './Home'

function AdminMainContent() {
    const [activeItem, setActiveItem] = useState('adminHome');
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate();

    const handleItemClick = (e, { name }) => setActiveItem(name);

    const handleLogout = () => {
        localStorage.removeItem("userToken");
        localStorage.removeItem("uid");
        localStorage.removeItem("isAdmin");
        navigate('/login',{ replace: true });
        window.location.reload();
    };

    const renderMenuItems = () => {
        if (selectedUser) {
            return (
                <>
                    <Menu.Item name='userHome' active={activeItem === 'userHome'} onClick={() => setActiveItem('userHome')}>
                        Home
                    </Menu.Item>
                    <Menu.Item name='userProfile' active={activeItem === 'userProfile'} onClick={() => setActiveItem('userProfile')}>
                        Profile
                    </Menu.Item>
                    <Menu.Item name='userFiles' active={activeItem === 'userFiles'} onClick={() => setActiveItem('userFiles')}>
                        Files
                    </Menu.Item>
                    <Menu.Item name='backToAdminHome' onClick={() => { setSelectedUser(null); setActiveItem('adminHome'); }}>
                        Back to Admin Home
                    </Menu.Item>
                </>
            );
        } else {
            return (
                <>
                    <Menu.Item name='adminHome' active={activeItem === 'adminHome'} onClick={handleItemClick} />
                    <Menu.Item name='userList' active={activeItem === 'userList'} onClick={handleItemClick} > Users</Menu.Item>
                    <Menu.Item name='registerNewUser' active={activeItem === 'registerNewUser'} onClick={handleItemClick} />
                </>
            );
        }
    };

    const renderAdminContent = () => {
        if (selectedUser) {
            switch (activeItem) {
                case 'userHome':
                    return <Home  user={selectedUser} />;
                case 'userProfile':
                    return <UserProfile user={selectedUser} />;
                case 'userFiles':
                    return <UserFile user={selectedUser} />;
                default:
                    return <div>Select a menu item</div>;
            }
        } else {
            switch (activeItem) {
                case 'adminHome':
                    return <AdminHome />;
                case 'userList':
                    return <AdminUserList onUserSelect={(user) => { setSelectedUser(user); setActiveItem('userHome'); }} />;
                case 'registerNewUser':
                    return <AdminRegister />;
                default:
                    return <div>Select a menu item</div>;
            }
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f0f0f0' }}>
            <Segment inverted style={{ marginBottom: '0', borderRadius: '0', position: 'sticky', top: 0, zIndex: 100 }}>
                <Menu inverted pointing secondary>
                    {renderMenuItems()}
                    <Menu.Item position='right' name='logout' onClick={handleLogout} />
                </Menu>
            </Segment>
            <Container style={{ flex: 1, padding: '0', display: 'flex', justifyContent: 'center', marginTop: '0' }}>
                <Segment style={{ width: '70%', border: '1px solid black', marginTop: '0', borderRadius: '0' }}>
                    {renderAdminContent()}
                </Segment>
            </Container>
        </div>
    );
}

export default AdminMainContent;
