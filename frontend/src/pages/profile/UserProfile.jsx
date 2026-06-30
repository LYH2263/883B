import { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import { Form, Input, Button, message, Card } from "antd";
import { useStateContext } from "../../contexts/ContextProvider";

export default function UserProfile() {
  const { setUser } = useStateContext();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axiosClient.get('/user')
      .then(({data}) => {
          form.setFieldsValue(data);
      })
      .catch(() => message.error('获取用户信息失败'));
  }, [form]);

  const onFinish = (values) => {
    setLoading(true);
    // Remove password if empty to avoid accidental update or error
    if (!values.password) {
        delete values.password;
    }
    // Remove password_confirmation if present
    if (values.password_confirmation) {
        delete values.password_confirmation;
    }

    axiosClient.put('/profile', values)
      .then(({data}) => {
          message.success('个人信息已更新');
          setUser(data);
          // Only reset password fields, keep others
          form.setFieldsValue({
            password: '',
            password_confirmation: ''
          });
          setLoading(false);
      })
      .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            message.error(response.data.message);
          } else {
            message.error('更新失败');
          }
          setLoading(false);
      });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Card title="个人中心" style={{ width: 600 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            label="姓名"
            name="name"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="邮箱"
            name="email"
            rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱格式' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="新密码 (留空则不修改)"
            name="password"
            rules={[{ min: 6, message: '密码至少6位' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="确认新密码"
            name="password_confirmation"
            dependencies={['password']}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              保存
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
