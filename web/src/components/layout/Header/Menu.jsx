import { Menu } from 'antd';
import { NavLink, useLocation } from 'react-router-dom';
import ROUTES from '../../../routes';
import useAuth from '../../../hooks/useAuth';
import logo from '../../../assets/images/logo.png';

const App = ({ color }) => {
  const { pathname } = useLocation();
  let page = pathname.replace('/', '');
  const { user } = useAuth();

  return (
    <>
      <div className='row menu'>
        <div className='brand col'>
          <img src={logo} alt='' />
          <span
            style={{
              textTransform: 'capitalize',
            }}
          >
            {user?.workspace?.name}
          </span>
        </div>
        <Menu className='col' theme='light' mode='horizontal'>
          {ROUTES.filter((e) => e.sidebar).map((e, i) => {
            const { icon: Icon } = e;
            if (!page) {
              page = 'dashboard';
            }
            return (
              <Menu.Item
                key={i}
                className={`${page === e.name ? 'ant-menu-item-selected' : ''}`}
              >
                <NavLink to={e.path}>
                  <span className='icon'>
                    <Icon />
                  </span>
                  <span className='label'>{e.title}</span>
                </NavLink>
              </Menu.Item>
            );
          })}
        </Menu>
      </div>
    </>
  );
};

export default App;
