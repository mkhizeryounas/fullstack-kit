import React from 'react';
import { Link } from 'react-router-dom';
import {
  Layout,
  Button,
  Row,
  Col,
  Typography,
  Form,
  Input,
  message,
} from 'antd';
import signinbg from '../assets/images/img-signin.jpg';
import useAuth from '../hooks/useAuth';

const { Title } = Typography;
const { Content } = Layout;

const SignIn = () => {
  const { isLoading, login } = useAuth();

  const onFinish = async (values) => {
    try {
      console.log('Form values:', values);
      await login({ ...values, returnTo: '/dashboard' });
      message.success('Sign in successfully');
    } catch (err) {
      console.log('signin error', err);
      message.error(err?.response?.data?.message || 'Something went wrong');
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Layout className='layout-default layout-signin'>
        <Content className='signin'>
          <Row gutter={[24, 0]} justify='space-around'>
            <Col
              xs={{ span: 24, offset: 0 }}
              lg={{ span: 6, offset: 2 }}
              md={{ span: 12 }}
            >
              <Title className='mb-15'>Sign In</Title>
              <Title className='font-regular text-muted' level={5}>
                Enter your email and password to signin on the workspace
              </Title>
              <Form
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout='vertical'
                className='row-col'
              >
                <Form.Item
                  className='username'
                  label='Workspace'
                  name='workspace'
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input placeholder='Workspace' />
                </Form.Item>

                <Form.Item
                  className='username'
                  label='Email'
                  name='email'
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input placeholder='Email' />
                </Form.Item>

                <Form.Item
                  className='username'
                  label='Password'
                  name='password'
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input.Password placeholder='Password' />
                </Form.Item>

                <Form.Item>
                  <Button
                    type='primary'
                    htmlType='submit'
                    style={{ width: '100%' }}
                    loading={isLoading}
                  >
                    SIGN IN
                  </Button>
                </Form.Item>
                <p className='font-semibold text-muted'>
                  Don't have an account?{' '}
                  <Link to='/sign-up' className='text-dark font-bold'>
                    Sign Up
                  </Link>
                </p>
              </Form>
            </Col>
            <Col
              className='sign-img'
              style={{ padding: 12 }}
              xs={{ span: 24 }}
              lg={{ span: 12 }}
              md={{ span: 12 }}
            >
              <img src={signinbg} alt='' />
            </Col>
          </Row>
        </Content>
      </Layout>
    </>
  );
};

export default SignIn;
