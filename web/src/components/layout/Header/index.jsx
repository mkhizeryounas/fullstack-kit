import { Row, Col } from 'antd';

import AccountButton from '../../AccountButton';
import Menu from './Menu';
import './style.scss';

function Header({ name, subName, onPress }) {
  // useEffect(() => window.scrollTo(0, 0));

  return (
    <>
      <Row gutter={[24, 0]}>
        <Col span={24} md={18} style={{ paddingLeft: 0 }}>
          <div className='ant-page-header-heading'>
            <span
              className='ant-page-header-heading-title'
              style={{
                textTransform: 'capitalize',
                paddingTop: '13px',
              }}
            >
              <Menu />
            </span>
          </div>
        </Col>
        <Col span={24} md={6} className='header-control'>
          <AccountButton />
          {/* <Button
            type='link'
            className='sidebar-toggler'
            onClick={() => onPress()}
          >
            <MenuUnfoldOutlined />
          </Button> */}
        </Col>
      </Row>
    </>
  );
}

export default Header;
