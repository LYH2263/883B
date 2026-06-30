import { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import { Table, Button, Space, message, Modal, Form, Input, InputNumber, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  const getCategories = () => {
      axiosClient.get('/categories').then(({data}) => setCategories(data));
  }

  const getProducts = () => {
    setLoading(true);
    axiosClient.get('/products')
      .then(({ data }) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    // eslint-disable-next-line
    getProducts();
    getCategories();
  }, []);

  const openModal = (product = null) => {
    setIsModalOpen(true);
    if (product) {
        setEditingId(product.id);
        form.setFieldsValue(product);
    } else {
        setEditingId(null);
        form.resetFields();
    }
  }

  const handleSubmit = (values) => {
      if (editingId) {
          axiosClient.put(`/products/${editingId}`, values)
            .then(() => {
                message.success('商品已更新');
                setIsModalOpen(false);
                setEditingId(null);
                getProducts();
            })
            .catch(() => message.error('更新失败'));
      } else {
          axiosClient.post('/products', values)
            .then(() => {
                message.success('商品已创建');
                setIsModalOpen(false);
                form.resetFields();
                getProducts();
            })
            .catch(() => {
                message.error('创建商品失败');
            })
      }
  }

  const deleteProduct = (id) => {
      Modal.confirm({
          title: '确定要删除吗？',
          content: '此操作不可恢复',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
              axiosClient.delete(`/products/${id}`)
                .then(() => {
                    message.success('已删除');
                    getProducts();
                })
                .catch(() => message.error('删除失败'));
          }
      });
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchText.toLowerCase()) || 
    String(p.id).includes(searchText)
  );

  const columns = [
      { title: 'ID', dataIndex: 'id', key: 'id' },
      { title: '名称', dataIndex: 'name', key: 'name' },
      { title: '价格', dataIndex: 'price', key: 'price' },
      { title: '库存', dataIndex: 'stock', key: 'stock' },
      { title: '分类', dataIndex: ['category', 'name'], key: 'category' },
      { 
          title: '操作', 
          key: 'action',
          fixed: 'right',
          width: 150,
          render: (_, record) => (
              <Space size="middle">
                  <Button type="primary" ghost onClick={() => openModal(record)}>编辑</Button>
                  <Button danger onClick={() => deleteProduct(record.id)}>删除</Button>
              </Space>
          )
      }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 className="text-2xl font-bold">商品列表</h1>
        <Space>
            <Input.Search 
                placeholder="搜索商品名称/ID" 
                onSearch={value => setSearchText(value)} 
                onChange={e => setSearchText(e.target.value)}
                style={{ width: 200 }} 
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal(null)}>新增商品</Button>
        </Space>
      </div>
      <Table 
        dataSource={filteredProducts} 
        columns={columns} 
        loading={loading} 
        rowKey="id" 
        pagination={{ pageSize: 10 }} 
        scroll={{ x: "max-content" }}
      />
      
      <Modal 
        title={editingId ? "编辑商品" : "新增商品"} 
        open={isModalOpen} 
        onOk={form.submit} 
        onCancel={() => setIsModalOpen(false)} 
        okText="确定" 
        cancelText="取消"
      >
          <Form form={form} onFinish={handleSubmit} layout="vertical">
              <Form.Item name="name" label="名称" rules={[{required: true, message: '请输入名称'}]}>
                  <Input />
              </Form.Item>
              <Form.Item name="category_id" label="分类" rules={[{required: true, message: '请选择分类'}]}>
                  <Select placeholder="选择分类">
                      {categories.map(c => (
                          <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
                      ))}
                  </Select>
              </Form.Item>
              <Form.Item name="price" label="价格" rules={[{required: true, message: '请输入价格'}]}>
                  <InputNumber style={{width: '100%'}} prefix="¥" />
              </Form.Item>
              <Form.Item name="stock" label="库存" rules={[{required: true, message: '请输入库存'}]}>
                  <InputNumber style={{width: '100%'}} />
              </Form.Item>
               <Form.Item name="description" label="描述">
                  <Input.TextArea />
              </Form.Item>
          </Form>
      </Modal>
    </div>
  );
}
