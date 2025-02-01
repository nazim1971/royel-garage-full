import { z } from "zod";
import { useRegisterMutation } from "../../redux/features/auth/authApi";
import { useState } from "react";
import { Button, Form, Input, message, Card, Row, Col, Upload } from "antd";
import { TResponse } from "../../types/globel";
import { useNavigate } from "react-router";
import { customerSchema } from "../../schema/customer.schema";
import { uploadImage } from "../../utils/uploadImage";
import { UploadOutlined } from '@ant-design/icons';

type TCustomer = {
  name: string;
  email: string;
  image?: string;
  password: string;
};

const Register = () => {
  const navigate = useNavigate();
  const [registerCustomer] = useRegisterMutation();
  const [form] = Form.useForm<TCustomer>();
  const [formErrors, setFormErrors] = useState<any>({});
  const [image, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false); // State to handle button loading

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      const url = await uploadImage(file);
      setImageUrl(url);
      message.success('Image uploaded successfully!');
    } catch (error) {
      message.error('Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  const onFinish = async (values: TCustomer) => {
    console.log(values);
    try {
      setFormErrors({});
      customerSchema.parse(values);
      const finalImageUrl = image;

      const customerData = {
        name: values.name,
        email: values.email,
        image: finalImageUrl,
        password: values.password,
      };
      console.log('Before', customerData);
      
      setLoading(true); // Start loading when the form is being submitted

      const res = (await registerCustomer(customerData)) as TResponse;
      console.log("RES", res);

      if (res?.error) {
        message.error(res.error?.data?.message || "Failed to create customer.");
        return;
      } else {
        message.success(res.data?.message || "Customer created successfully!");
        navigate('/login');
      }
    } catch (error) {
      console.log("epppp", error);
      if (error instanceof z.ZodError) {
        const fieldErrors: any = {};
        error.errors.forEach((err) => {
          const fieldName = err.path[0];
          fieldErrors[fieldName] = err.message;
        });
        setFormErrors(fieldErrors);
      }
    } finally {
      setLoading(false); // Reset loading state after form submission is complete
    }
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
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          zIndex: 1,
        }}
      />

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
                Create an Account
              </div>
              <p
                style={{
                  textAlign: "center",
                  fontWeight: "normal",
                  color: "GrayText",
                  paddingBottom: "10px",
                }}
              >
                Please enter your details to register
              </p>
            </>
          }
        >
          <Form
            form={form}
            name="register"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item<TCustomer>
              label="Name"
              name="name"
              validateStatus={formErrors.name ? "error" : ""}
              help={formErrors.name}
            >
              <Input placeholder="Enter your full name" />
            </Form.Item>

            <Form.Item<TCustomer>
              label="Email"
              name="email"
              validateStatus={formErrors.email ? "error" : ""}
              help={formErrors.email}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>

            <Form.Item<TCustomer>
              label="Password"
              name="password"
              validateStatus={formErrors.password ? "error" : ""}
              help={formErrors.password}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>

            <Form.Item label="User Image" valuePropName="fileList">
              <Upload
                name="file"
                listType="picture"
                maxCount={1}
                beforeUpload={(file) => {
                  handleUpload(file);
                  return false;
                }}
                showUploadList={{ showRemoveIcon: true }}
              >
                <Button icon={<UploadOutlined />} loading={uploading}>
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </Button>
              </Upload>
            </Form.Item>

            <Form.Item style={{ textAlign: "center", width: "100%" }}>
              <Button
                type="default"
                htmlType="submit"
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "black",
                  color: "white",
                  border: "none",
                  fontWeight: "500",
                  fontSize: "16px",
                  borderRadius: "4px",
                  transition: "background-color 0.3s, opacity 0.3s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = "0.8"}
                onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                loading={loading} // Add loading prop to button
              >
                {loading ? 'Registering...' : 'Register'}
              </Button>
            </Form.Item>
          </Form>

          <Row justify="center">
            <Col>
              <Button
                href="/login"
                type="link"
                style={{
                  color: "#1890ff",
                  textAlign: "center",
                  padding: 0,
                }}
              >
                Already have an account? Login
              </Button>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default Register;
