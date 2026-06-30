import { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import { Table, Button, Space, message, Modal, Form, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  const getCategories = () => {
    setLoading(true);
    axiosClient.get('/categories')
      .then(({ data }) => {
        setCategories(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    // eslint-disable-next-line
    getCategories();
  }, []);

  const openModal = (category = null) => {
    setIsModalOpen(true);
    if (category) {
        setEditingId(category.id);
        form.setFieldsValue(category);
    } else {
        setEditingId(null);
        form.resetFields();
    }
  }

  const handleSubmit = (values) => {
    if (editingId) {
        axiosClient.put(`/categories/${editingId}`, values)
          .then(() => {
              message.success('分类已更新');
              setIsModalOpen(false);
              setEditingId(null);
              getCategories();
          })
          .catch(() => message.error('更新失败'));
    } else {
        axiosClient.post('/categories', values)
          .then(() => {
              message.success('分类已创建');
              setIsModalOpen(false);
              form.resetFields();
              getCategories();
          })
          .catch(() => message.error('创建失败'));
    }
  }

  const deleteCategory = (id) => {
    Modal.confirm({
      title: '确定要删除吗？',
      content: '此操作不可恢复',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        axiosClient.delete(`/categories/${id}`)
          .then(() => {
              message.success('已删除');
              getCategories();
          })
          .catch(() => message.error('删除失败'));
      },
    });
  }

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchText.toLowerCase()) || 
    (c.description && c.description.toLowerCase().includes(searchText.toLowerCase()))
  );

  const columns = [
      { title: 'ID', dataIndex: 'id', key: 'id' },
      { title: '名称', dataIndex: 'name', key: 'name' },
      { title: '描述', dataIndex: 'description', key: 'description' },
      { 
        title: '操作', 
        key: 'action',
        fixed: 'right',
        width: 150,
        render: (_, record) => (
            <Space size="middle">
                <Button type="primary" ghost onClick={() => openModal(record)}>编辑</Button>
                <Button danger onClick={() => deleteCategory(record.id)}>删除</Button>
            </Space>
        )
      }
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <h1 className="text-2xl font-bold">分类列表</h1>
        <Space>
          <Input.Search
            placeholder="搜索分类名称"
            onSearch={(value) => setSearchText(value)}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openModal(null)}
          >
            新增分类
          </Button>
        </Space>
      </div>
      <Table
        dataSource={filteredCategories}
        columns={columns}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
      />

      <Modal
        title={editingId ? "编辑分类" : "新增分类"}
        open={isModalOpen}
        onOk={form.submit}
        onCancel={() => setIsModalOpen(false)}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: "请输入名称" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
