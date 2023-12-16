import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Segment, Container } from 'semantic-ui-react';
import AdminHome from './AdminHome';
import AdminUserList from './AdminUserList';
import AdminRegister from './AdminRegister';
import AdminUserFile from '../adminToUser/AdminUserFile';
import AdminUserProfile from '../adminToUser/AdminUserProfile';
import AdminUserHome from '../adminToUser/AdminUserHome';
import { useAuth } from '../AuthContext';

function AdminMainContent() {
    const storedUserId = localStorage.getItem('selectedUserId');
    const initialActiveItem = storedUserId ? 'userHome' : 'adminHome';
    const [activeItem, setActiveItem] = useState(initialActiveItem);
    const [selectedUser, setSelectedUser] = useState(() => {
        const storedUserId = localStorage.getItem('selectedUserId');
        return storedUserId ? { userId: storedUserId } : null;
    });
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
      
      

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        localStorage.setItem('selectedUserId', user.userId);
        setActiveItem('userProfile'); // Or any other item you want to navigate to
    };

    const handleBackToAdminHome = () => {
        setSelectedUser(null);
        localStorage.removeItem('selectedUserId'); // Clear selected user ID
        setActiveItem('adminHome');
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
                    <Menu.Item name='backToAdminHome' onClick={handleBackToAdminHome}>
                        Back to Admin Home
                    </Menu.Item>
                </>
            );
        } else {
            return (
                <>
                    <Menu.Item name='adminHome' active={activeItem === 'adminHome'} onClick={handleItemClick} />
                    <Menu.Item name='userList' active={activeItem === 'userList'} onClick={handleItemClick}>Users</Menu.Item>
                    <Menu.Item name='registerNewUser' active={activeItem === 'registerNewUser'} onClick={handleItemClick}>Register New User</Menu.Item>
                </>
            );
        }
    };

    const renderAdminContent = () => {
        if (selectedUser) {
            switch (activeItem) {
                case 'userHome':
                    return <AdminUserHome />;
                case 'userProfile':
                    return <AdminUserProfile />;
                case 'userFiles':
                    return <AdminUserFile />;
                default:
                    return <div>Select a menu item</div>;
            }
        } else {
            switch (activeItem) {
                case 'adminHome':
                    return <AdminHome />;
                case 'userList':
                    return <AdminUserList onUserSelect={handleUserSelect} />;
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
