import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

import './style.scss';

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
    }}
    spin
  />
);

const App = ({ text = 'Loading...' }) => (
  <div className='fullscreen-center'>
    <Spin indicator={antIcon} />
    {' ' + text}
  </div>
);

export default App;
