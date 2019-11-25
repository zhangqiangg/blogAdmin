import React from 'react';
import {
  Form,
  Input,
  Tooltip,
  Icon,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete,
} from 'antd';
import SimpleMDE from 'simplemde';
import 'simplemde/dist/simplemde.min.css';
import marked from 'marked';
import highlight from 'highlight.js';
import './style.less';
import { connect } from 'dva';
import * as API from '../../services/api';

const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;

const children: [] = [];
for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

@connect(({ article }) => ({
  article,
}))
interface StateType {
  title: String;
  author: String;
  keyword: String;
  describle: String;
  cover_link: String;
  // tags: String;
  // categoey: String;
  smde: any;
  confirmDirty: boolean;
  autoCompleteResult: any[];
}
class CreateArticle extends React.Component<StateType> {
  state: StateType = {
    confirmDirty: false,
    autoCompleteResult: [],
    smde: null,
    title: '',
    author: '',
    keyword: '',
    describle: '',
    cover_link: '',
    // tags: '',
    // category: '',
  };

  componentDidMount() {
    this.state.smde = new SimpleMDE({
      element: document.getElementById('editor').childElementCount,
      autofocus: true,
      autosave: true,
      previewRender(plainText) {
        return marked(plainText, {
          renderer: new marked.Renderer(),
          gfm: true,
          pedantic: false,
          sanitize: false,
          tables: true,
          breaks: true,
          smartLists: true,
          smartypants: true,
          highlight(code) {
            return highlight.highlightAuto(code).value;
          },
        });
      },
    });
  }

  handleSubmit = e => {
    const { dispatch } = this.props;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      // if (!err) {
      //   return console.log('Received values of form: ', values);
      // }
      const params = {
        title: this.state.title,
        author: this.state.author,
        keyword: this.state.keyword,
        describle: this.state.describle,
        cover_link: this.state.cover_link,
        // tags: this.state.tags,
        // category: this.state.category,
        content: this.state.smde.value(),
      };
      dispatch({
        type: 'article/addArticle',
        payload: params,
      });
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  handleWebsiteChange = (value: any) => {
    let autoCompleteResult: any;
    if (!value) {
      autoCompleteResult = [];
    } else {
      autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
    }
    this.setState({ autoCompleteResult });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { autoCompleteResult } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 1 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 1,
        },
      },
    };

    const websiteOptions = autoCompleteResult.map(website => (
      <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
    ));

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        {/* <Form.Item label="标题">
          {getFieldDecorator('title', {
            initialValue: this.state.title,
            rules: [
              {
                required: true,
                message: '请输入文章标题',
              },
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="作者" required>
          {getFieldDecorator('author', {
            initialValue: this.state.author,
            rules: [
              {
                required: true,
                message: '请输入作者',
              },
            ],
          })(<Input />)}
        </Form.Item> */}
        <Form.Item label="标题">{<Input name="title" value={this.state.title} />}</Form.Item>
        <Form.Item label="作者">{<Input value={this.state.author} />}</Form.Item>

        <Form.Item label="关键字">{<Input value={this.state.keyword} />}</Form.Item>
        <Form.Item label="描述">{<Input value={this.state.describle} />}</Form.Item>
        <Form.Item label="封面链接">
          <AutoComplete
            dataSource={websiteOptions}
            onChange={this.handleWebsiteChange}
            placeholder="website"
          >
            <Input value={this.state.cover_link} />
          </AutoComplete>
        </Form.Item>
        <Form.Item label="文章设置">
          <Select defaultValue="发布" style={{ width: 150, marginRight: '10px' }}>
            <Option value="发布">发布</Option>
            <Option value="草稿">草稿</Option>
          </Select>
          <Select defaultValue="普通文章" style={{ width: 150, marginRight: '10px' }}>
            <Option value="普通文章">普通文章</Option>
            <Option value="简历">简历</Option>
            <Option value="管理员介绍">管理员介绍</Option>
          </Select>
          <Select defaultValue="原创" style={{ width: 150, marginRight: '10px' }}>
            <Option value="原创">原创</Option>
            <Option value="转载">转载</Option>
            <Option value="混合">混合</Option>
          </Select>
          <Select
            mode="multiple"
            style={{ width: 150, marginRight: '10px' }}
            placeholder="请选择标签"
            defaultValue={['a10']}
          >
            {children}
          </Select>
          <Select
            mode="multiple"
            style={{ width: 150, marginRight: '10px' }}
            placeholder="请选择分类"
            defaultValue={['a10']}
          >
            {children}
          </Select>
        </Form.Item>
        <Form.Item label="文章内容">
          <textarea id="editor" style={{ marginBottom: 20, width: 800 }} size="large" rows={8} />
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create({ name: 'register' })(CreateArticle);
