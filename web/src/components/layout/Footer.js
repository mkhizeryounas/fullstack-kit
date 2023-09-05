import { Layout, Row, Col } from 'antd';

function Footer() {
  const { Footer: AntFooter } = Layout;

  return (
    <AntFooter style={{ background: '#fafafa' }}>
      <Row className='just'>
        <Col xs={24} md={12} lg={12}>
          {/* <div className='copyright'>
            © {new Date().getUTCFullYear()}, All rights reserved.
          </div> */}
        </Col>
        <Col xs={24} md={12} lg={12}>
          <div className='footer-menu'>
            <ul>
              {/* <li className='nav-item'>
                <a
                  href='#pablo'
                  className='nav-link text-muted'
                  target='_blank'
                >
                  Documentation
                </a>
              </li>
              <li className='nav-item'>
                <a
                  href='#pablo'
                  className='nav-link text-muted'
                  target='_blank'
                >
                  Github
                </a>
              </li> */}
            </ul>
          </div>
        </Col>
      </Row>
    </AntFooter>
  );
}

export default Footer;
