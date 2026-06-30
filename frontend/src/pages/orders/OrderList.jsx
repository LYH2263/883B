import { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import { Table, Button, Space, message, Select, Modal, Form, InputNumber, Input, DatePicker } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();

  const getOrders = () => {
    setLoading(true);
    axiosClient.get('/orders')
      .then(({ data }) => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    // eslint-disable-next-line
    getOrders();
  }, []);

  const openModal = (order = null) => {
    setIsModalOpen(true);
    if (order) {
        setEditingId(order.id);
        form.setFieldsValue({
            ...order,
            created_at: order.created_at ? dayjs(order.created_at) : null
        });
    } else {
        setEditingId(null);
        form.resetFields();
        form.setFieldsValue({ status: 'pending', created_at: dayjs() });
    }
  }

  const handleSubmit = (values) => {
      const payload = {
          ...values,
          created_at: values.created_at ? values.created_at.format('YYYY-MM-DD HH:mm:ss') : null
      };

      if (editingId) {
          axiosClient.put(`/orders/${editingId}`, payload)
            .then(() => {
                message.success('订单已更新');
                setIsModalOpen(false);
                setEditingId(null);
                getOrders();
            })
            .catch(() => message.error('更新失败'));
      } else {
          axiosClient.post('/orders', payload)
            .then(() => {
                message.success('订单已创建');
                setIsModalOpen(false);
                form.resetFields();
                getOrders();
            })
            .catch(() => message.error('创建失败'));
      }
  }

  const deleteOrder = (id) => {
    Modal.confirm({
        title: '确定要删除此订单吗？',
        content: '此操作不可恢复',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
            axiosClient.delete(`/orders/${id}`)
              .then(() => {
                  message.success('订单已删除');
                  getOrders();
              })
              .catch(() => message.error('删除失败'));
        }
    });
  }

  const updateStatus = (id, status) => {
      axiosClient.put(`/orders/${id}`, { status })
        .then(() => {
            message.success('状态已更新');
            getOrders();
        })
        .catch(() => message.error('更新失败'));
  }

  const filteredOrders = orders.filter(o => 
    String(o.id).includes(searchText) || 
    (o.customer_name && o.customer_name.toLowerCase().includes(searchText.toLowerCase()))
  );

  const columns = [
      { title: 'ID', dataIndex: 'id', key: 'id' },
      { title: '客户', dataIndex: 'customer_name', key: 'customer_name' },
      { title: '总价', dataIndex: 'total_price', key: 'total_price', render: (val) => `¥${val}` },
      { 
          title: '状态', 
          dataIndex: 'status', 
          key: 'status',
          render: (status, record) => (
              <Select 
                value={status} 
                style={{ width: 120 }} 
                onChange={(val) => updateStatus(record.id, val)}
                options={[
                    { value: 'pending', label: '待处理' },
                    { value: 'completed', label: '已完成' },
                    { value: 'cancelled', label: '已取消' },
                ]}
              />
          )
      },
      { title: '日期', dataIndex: 'created_at', key: 'created_at', render: (date) => new Date(date).toLocaleDateString() },
      {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 150,
          render: (_, record) => (
              <Space>
                <Button type="primary" ghost onClick={() => openModal(record)}>编辑</Button>
                <Button danger onClick={() => deleteOrder(record.id)}>删除</Button>
              </Space>
          )
      }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 className="text-2xl font-bold">订单列表</h1>
        <Space>
          <Input.Search 
              placeholder="搜索订单ID/客户名" 
              onSearch={value => setSearchText(value)} 
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 250 }} 
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal(null)}>新增订单</Button>
        </Space>
      </div>
      <Table 
        dataSource={filteredOrders} 
        columns={columns} 
        loading={loading} 
        rowKey="id" 
        pagination={{ pageSize: 10 }} 
        scroll={{ x: "max-content" }}
      />

      <Modal 
        title={editingId ? "编辑订单" : "新增订单"} 
        open={isModalOpen} 
        onOk={form.submit} 
        onCancel={() => setIsModalOpen(false)} 
        okText="确定" 
        cancelText="取消"
      >
          <Form form={form} onFinish={handleSubmit} layout="vertical" initialValues={{ status: 'pending' }}>
              <Form.Item name="customer_name" label="客户" rules={[{required: true, message: '请输入客户名'}]}>
                  <Input placeholder="输入客户名" />
              </Form.Item>
              <Form.Item name="total_price" label="总价" rules={[{required: true, message: '请输入总价'}]}>
                  <InputNumber style={{width: '100%'}} prefix="¥" />
              </Form.Item>
              <Form.Item name="status" label="状态">
                  <Select>
                    <Select.Option value="pending">待处理</Select.Option>
                    <Select.Option value="completed">已完成</Select.Option>
                    <Select.Option value="cancelled">已取消</Select.Option>
                  </Select>
              </Form.Item>
              <Form.Item name="created_at" label="订单日期" rules={[{required: true, message: '请选择日期'}]}>
                  <DatePicker showTime style={{width: '100%'}} />
              </Form.Item>
          </Form>
      </Modal>
    </div>
  );
}
