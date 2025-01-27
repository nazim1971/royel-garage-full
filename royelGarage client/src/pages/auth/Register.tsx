import { z } from "zod";
import { useRegisterMutation } from "../../redux/features/auth/authApi";
import { useState } from "react";
import { Button, Form, Input, message } from "antd";
import { TResponse } from "../../types/globel";
import { useNavigate } from "react-router";
import { customerSchema } from "../../schema/customer.schema";

type TCustomer = {
  name: string;
  email: string;
  password: string;
};



const Register = () => {

  const navigate = useNavigate();

  const [registerCustomer] = useRegisterMutation();
  //create a form instance
  const [form] = Form.useForm<TCustomer>();
  const [formErrors, setFormErrors] = useState<any>({});

  const onFinish = async (values: TCustomer) => {
    console.log(values);
    try {
      // Clear previous errors
      setFormErrors({});

      // Validate form data with Zod
      customerSchema.parse(values);

      const customerData = {
        name: values.name,
        email: values.email,
        password: values.password,
      };

      //post
      const res = (await registerCustomer(customerData)) as TResponse;
      console.log("RES", res);

      if (res?.error) {
        // Display error message from server response
        message.error(res.error?.data?.message || "Failed to create customer.");
        return; // Stop further execution if there's an error
      } else {
        message.success(res.data?.message || "Customer created successfully!");
        //  refetch();
        navigate('/login')
      }
    } catch (error) {
      console.log("epppp", error);
      if (error instanceof z.ZodError) {
        // Map Zod errors to field errors
        const fieldErrors: any = {};
        error.errors.forEach((err) => {
          const fieldName = err.path[0];
          fieldErrors[fieldName] = err.message;
        });
        setFormErrors(fieldErrors); // Set the form errors
      }
    }
  };

  return (
   <>
    <Form
    form={form}
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600, paddingTop: "40px" }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item<TCustomer>
        label="Name"
        name="name"
        validateStatus={formErrors.name ? "error" : ""}
        help={formErrors.name}
      >
        <Input />
      </Form.Item>

      <Form.Item<TCustomer>
        label="Email"
        name="email"
        validateStatus={formErrors.name ? "error" : ""}
        help={formErrors.name}
      >
        <Input />
      </Form.Item>

      <Form.Item<TCustomer>
        label="Password"
        name="password"
        validateStatus={formErrors.name ? "error" : ""}
        help={formErrors.name}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item label={null}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>

    <Button href="/login"> Login</Button>
   </>
  );
};

export default Register;
