import { Button, Form, FormProps, Input, message } from "antd";
import { useAppDispatch } from "../../redux/hooks";
import { useNavigate } from "react-router";
import { useLoginMutation } from "../../redux/features/auth/authApi";
import { verifyToken } from "../../utils/verifyToken";
import { setUser, TUser } from "../../redux/features/auth/authSlice";

type FieldType = {
  email?: string;
  password?: string;
};


const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [login, {data, error} ] = useLoginMutation();

console.log("data=> ", data);
console.log("error", error);

const onFinish: FormProps<FieldType>['onFinish'] =  async(values) => {
  
  console.log('Success:', values);
  const userInfo = {
    email: values.email,
    password: values.password
  }
  try {
    const res = await login(userInfo).unwrap();
    const user = verifyToken(res.data?.token) as TUser;

    dispatch(setUser({ user: user, token: res.data?.token }));

    // Show success message using Ant Design's message component
    message.success('Login successful!');

    navigate(`/${user.role}/dashboard`)  
  } catch (error: any) {
    const err = error as {status?: number};
    if (err?.status === 403) {
      // Show specific error for incorrect password or credentials
      message.error('Login failed. Please check your credentials.');
    } else {
      // Handle any other errors
      console.error("Login error:", error);
    }
  }
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

  return (
    <Form
    
    name="basic"
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ maxWidth: 600 ,paddingTop: '40px'}}
    initialValues={{ remember: true }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
  >
    <Form.Item<FieldType>
      label="Email"
      name="email"
      rules={[{ required: true, message: 'Please input your email!' }]}
    >
      <Input />
    </Form.Item>

    <Form.Item<FieldType>
      label="Password"
      name="password"
      rules={[{ required: true, message: 'Please input your password!' }]}
    >
      <Input.Password />
    </Form.Item>

    <Form.Item label={null}>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </Form>
  )
}

export default Login