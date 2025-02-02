import { Button, Form, Input, message, Card, Row, Col, FormProps, Spin } from "antd";
import { useAppDispatch } from "../../redux/hooks";
import { useNavigate, useLocation } from "react-router";
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
  // const location = useLocation();
  // const from = location.state?.from?.pathname // Post-login redirection

  const [login, { data, error, isLoading }] = useLoginMutation(); // Track loading state

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const userInfo = {
      email: values.email,
      password: values.password,
    };
    try {
      const res = await login(userInfo).unwrap();
      const user = verifyToken(res.data?.token) as TUser;

      dispatch(setUser({ user: user, token: res.data?.token }));

      // Show success message using Ant Design's message component
      message.success("Login successful!");
      navigate(`/${user.role}`);
    } catch (error: any) {
      const err = error as { data?: { message?: string } };
      if (err?.data) {
        message.error(err?.data?.message);
      } else {
        console.error("Login error:", error);
      }
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage:
          "url(https://res.cloudinary.com/dfvgxf4dc/image/upload/v1738403287/close-up-vintage-motorcycle_1232-2667_py650b.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
      }}
    >
      {/* Overlay for background image with white opacity */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.3)", // 30% white opacity
          zIndex: 1,
        }}
      />

      {/* Card for login form */}
      <div style={{ zIndex: 2, position: "relative" }}>
        <Card
          style={{
            width: "100%",
            maxWidth: 400,
            padding: "30px",
            borderRadius: "10px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            zIndex: 2,
          }}
          title={
            <>
              <div
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "24px",
                  paddingBottom: "10px",
                }}
              >
                Welcome Back
              </div>
              <p
                style={{
                  textAlign: "center",
                  fontWeight: "normal",
                  color: "GrayText",
                  paddingBottom: "10px",
                }}
              >
                Please enter your details
              </p>
            </>
          }
        >
          <Form
            name="basic"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item<FieldType>
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>

            <Form.Item<FieldType>
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please input your password!" }]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>

            <Form.Item style={{ textAlign: "center", width: "100%" }}>
              <Button
                type="default"
                htmlType="submit"
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "black", // Initial background color
                  color: "white",
                  border: "none", // Remove border for a cleaner look
                  fontWeight: "500", // Bold text for a stronger effect
                  fontSize: "16px", // Slightly larger text
                  borderRadius: "4px", // Rounded corners
                  transition: "background-color 0.3s, opacity 0.3s", // Smooth transition for hover effect
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")} // Set opacity on hover
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                loading={isLoading} // Add the loading prop to show spinner
              >
                {isLoading ? <Spin /> : "Login"} {/* Show spinner when loading */}
              </Button>
            </Form.Item>
          </Form>

          <Row justify="center">
            <Col>
              <Button
                href="/register"
                type="link"
                style={{
                  color: "#1890ff",
                  textAlign: "center",
                  padding: 0,
                }}
              >
                Don't have an account? Register
              </Button>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default Login;
