import { useState } from "react";
import axiosClient from "../../axios-client.js";
import { useStateContext } from "../../contexts/ContextProvider.jsx";
import { Form, Input, Button, Card, message, Alert } from "antd";

export default function Login() {
  const { setUser, setToken } = useStateContext();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    axiosClient.post('/login', values)
      .then(({data}) => {
        setUser(data.user);
        setToken(data.token);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
            message.error(response.data.message || '验证错误');
        } else {
            message.error("登录失败");
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <Card title="登录后台管理系统" bordered={false} className="shadow-lg">
      <Form name="login" onFinish={onFinish} layout="vertical">
        <Form.Item name="email" label="邮箱" rules={[{ required: true, type: 'email', message: '请输入有效的邮箱' }]}>
            <Input />
        </Form.Item>
        <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password />
        </Form.Item>
        <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>登录</Button>
        </Form.Item>
      </Form>
      
      <div style={{ marginTop: 16 }}>
        <Alert
          message="体验账号"
          description={
            <div style={{ fontSize: '12px' }}>
              <div>账号：test@example.com</div>
              <div>密码：password</div>
            </div>
          }
          type="info"
          showIcon
        />
      </div>
    </Card>
  );
}
