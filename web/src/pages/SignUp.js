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

const SignUp = () => {
  const { isLoading, signup, checkWorkspaceAvailability } = useAuth();

  const onFinish = async (values) => {
    try {
      console.log('Form values:', values);
      await signup(values);
      message.success('Sign up successfully');
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
              <Title className='mb-15'>Sign Up</Title>
              <Title className='font-regular text-muted' level={5}>
                Create a new account
              </Title>
              <Form
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout='vertical'
                className='row-col'
              >
                <Form.Item
                  className='username'
                  label='Full name'
                  name='name'
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input placeholder='Full name' />
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
                  label='Workspace'
                  name='workspace'
                  rules={[
                    {
                      required: true,
                      validator: async (rule, value) => {
                        if (!value || value.trim() === '') {
                          throw new Error(`'workspace' is required`);
                        }
                        const isAvailable = await checkWorkspaceAvailability({
                          name: value,
                        });
                        console.log('isAvailable', isAvailable);
                        if (!isAvailable) {
                          throw new Error('Workspace name is already taken');
                        }
                      },
                    },
                  ]}
                >
                  <Input
                    placeholder='Workspace'
                    onChange={(data) => {
                      console.log('data', data.target.value);
                    }}
                  />
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
                    SIGN UP
                  </Button>
                </Form.Item>
                <p className='font-semibold text-muted'>
                  Already have an account?{' '}
                  <Link to='/sign-in' className='text-dark font-bold'>
                    Sign In
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

export default SignUp;
