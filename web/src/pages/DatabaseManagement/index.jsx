import { Layout, Empty } from 'antd';
import './style.scss';

const { Sider, Content } = Layout;

const DatabaseManagement = () => {
  return (
    <>
      <Layout className=''>
        <Sider width={250} className='side-panel'>
          <h2>Sider Menu</h2>
        </Sider>

        <Content
          style={{
            marginLeft: '260px',
            overflow: 'initial',
            padding: '10px 0',
          }}
        >
            <Empty description={'No table selected'} />
        </Content>
      </Layout>
    </>
  );
};

export default DatabaseManagement;
