import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Button, Avatar, Badge } from 'antd';
import { useHistory } from 'react-router-dom';

import './styles.scss';
import useAuth from '../../hooks/useAuth';

const AccountButton = () => {
  const { user, logout } = useAuth();
  const history = useHistory();

  const getInitials = (name) => {
    let rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');

    let initials = [...name.matchAll(rgx)] || [];

    initials = (
      (initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')
    ).toUpperCase();
    return initials;
  };

  const menu = (
    <Menu
      items={[
        {
          label: 'Profile',
          key: '1',
          icon: <UserOutlined />,
          onClick: () => history.push('/profile'),
        },
        {
          label: 'Sign out',
          key: '2',
          icon: <LockOutlined />,
          onClick: () => logout({ returnTo: window.location.origin }),
        },
      ]}
    />
  );

  return (
    <Badge size='small' count={0}>
      <Dropdown overlay={menu} trigger={['click']}>
        <Button
          type='text'
          size='large'
          className='account-btn'
          icon={
            <Avatar style={{ backgroundColor: '#f56a00' }}>
              {getInitials(user.name)}
            </Avatar>
          }
        >
          <span className='name-span'>{user.name}</span>
        </Button>
      </Dropdown>
    </Badge>
  );
};

export default AccountButton;
