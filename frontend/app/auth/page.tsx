"use client";

import React, { useEffect, useState } from "react";
import { MyAppHook } from "@/context/AppProvider";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { loginSchema, registerSchema } from "../../schemas/index";

const Auth: React.FC = () => {
  const onSubmit = () => {
    handleFormSubmit();
  };
  const [isLogin, setIsLogin] = useState<boolean>(true);

  const { login, register, authToken, isLoading, setIsLoading } = MyAppHook();

  const handleFormSubmit = async () => {
    if (isLogin) {
      try {
        await login(values.email, values.password);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await register(
          values.name!,
          values.email,
          values.password,
          values.password_confirmation!
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  const router = useRouter();

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormik({
      initialValues: {
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
      },
      validationSchema: isLogin ? loginSchema : registerSchema,
      onSubmit,
    });

  useEffect(() => {
    if (authToken) {
      setIsLoading(true);
      router.push("/dashboard");
      setIsLoading(false);
    }
  }, [authToken, isLoading]);
  return (
    <>
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="card p-4" style={{ width: "400px" }}>
          <h3 className="text-center">{isLogin ? "Login" : "Register"} </h3>
          <form onSubmit={handleSubmit} noValidate>
            {!isLogin && (
              <div>
                <input
                  className="form-control mb-2"
                  name="name"
                  type="text"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Name"
                  required
                />
                {errors.name && touched.name && (
                  <p className="mt-2 fs-6 text-danger">{errors.name}</p>
                )}
              </div>
            )}

            <input
              className="form-control mb-2"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Email"
              required
            />
            {errors.email && touched.email && (
              <p className="mt-2 fs-6 text-danger">{errors.email}</p>
            )}
            <input
              className="form-control mb-2"
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Password"
              required
            />
            {errors.password && touched.password && (
              <p className="mt-2 fs-6 text-danger">{errors.password}</p>
            )}

            {!isLogin && (
              <div>
                <input
                  className="form-control mb-2"
                  name="password_confirmation"
                  type="password"
                  value={values.password_confirmation}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Confirm Password"
                  required
                />
                {errors.password_confirmation &&
                  touched.password_confirmation && (
                    <p className="mt-2 fs-6 text-danger">
                      {errors.password_confirmation}
                    </p>
                  )}
              </div>
            )}

            <button className="btn btn-primary w-100" type="submit">
              {isLogin ? "Login" : "Register"}
            </button>
          </form>

          <p className="mt-3 text-center" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? " Dont have an account?" : "Already have an account ?"}
            <span className="text-primary pointer ">
              {isLogin ? " Register" : "Login"}
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Auth;
