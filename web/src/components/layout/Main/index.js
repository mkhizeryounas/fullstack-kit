import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Layout, Drawer, Affix } from 'antd';
import Sidenav from '../Sidenav';
import Header from '../Header/index.jsx';
import Footer from '../Footer';
import './style.scss';
import 'bootstrap-grid-only-css/dist/css/bootstrap-grid.min.css';

const { Header: AntHeader, Content, Sider } = Layout;

function Main(props) {
  const { children } = props;

  const [visible, setVisible] = useState(false);
  const [sidenavColor, setSidenavColor] = useState('#1890ff');
  const [sidenavType, setSidenavType] = useState('transparent');
  const [fixed, setFixed] = useState(false);

  const openDrawer = () => setVisible(!visible);
  const handleSidenavType = (type) => setSidenavType(type);
  const handleSidenavColor = (color) => setSidenavColor(color);
  const handleFixedNavbar = (type) => setFixed(type);

  let { pathname } = useLocation();
  pathname = pathname.replace('/', '');

  return (
    <Layout
      className={`layout-dashboard ${
        pathname === 'profile' ? 'layout-profile' : ''
      } ${pathname === 'rtl' ? 'layout-dashboard-rtl' : ''} bootstrap-wrapper`}
    >
      <Drawer
        title={false}
        placement={'left'}
        closable={false}
        onClose={() => setVisible(false)}
        visible={visible}
        key={'left'}
        width={250}
        className={`drawer-sidebar`}
      >
        <Layout className={`layout-dashboard`}>
          <Sider
            trigger={null}
            width={250}
            theme='light'
            className={`sider-primary ant-layout-sider-primary ${
              sidenavType === '#fff' ? 'active-route' : ''
            }`}
            style={{ background: sidenavType }}
          >
            <Sidenav color={sidenavColor} />
          </Sider>
        </Layout>
      </Drawer>
      {/* <Sider
        breakpoint='lg'
        collapsedWidth='0'
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
        trigger={null}
        width={250}
        theme='light'
        className={`sider-primary ant-layout-sider-primary ${
          sidenavType === '#fff' ? 'active-route' : ''
        }`}
        style={{ background: sidenavType }}
      >
        <Sidenav color={sidenavColor} />
      </Sider> */}
      <Layout>
        {fixed ? (
          <Affix>
            <AntHeader className={`${fixed ? 'ant-header-fixed' : ''}`}>
              <Header
                onPress={openDrawer}
                name={pathname}
                subName={pathname}
                handleSidenavColor={handleSidenavColor}
                handleSidenavType={handleSidenavType}
                handleFixedNavbar={handleFixedNavbar}
              />
            </AntHeader>
          </Affix>
        ) : (
          <AntHeader className={`${fixed ? 'ant-header-fixed' : ''}`}>
            <Header
              onPress={openDrawer}
              name={pathname}
              subName={pathname}
              handleSidenavColor={handleSidenavColor}
              handleSidenavType={handleSidenavType}
              handleFixedNavbar={handleFixedNavbar}
            />
          </AntHeader>
        )}
        <Content className='content-ant'>{children}</Content>
        <Footer />
      </Layout>
    </Layout>
  );
}

export default Main;
