"use client";

import { MyAppHook } from "@/context/AppProvider";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
interface productData {
  id: number;
  title: string;
  discription: string;
  price: number;
  file: File | null;
  banner_image: string;
}

interface productToEdit {
  id: number;
  title: string;
  discription: string;
  price: number;
  file: File | null;
  banner_image: string;
}
const Dashboard: React.FC = () => {
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;
  const fileRef = useRef<HTMLInputElement>(null);
  const { authToken, setIsLoading, products, getProducts } = MyAppHook();
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        file: e.target.files[0],
        banner_image: URL.createObjectURL(e.target.files[0]),
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const [formData, setFormData] = useState<productData | productToEdit>({
    id: 0,
    title: "",
    discription: "",
    price: 0,
    file: null,
    banner_image: "",
  });

  const handleAddProduct = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${API_URL}/products`, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      console.log("response:", response);
      if (response.data.status) {
        setFormData({
          id: 0,
          title: "",
          discription: "",
          price: 0,
          file: null,
          banner_image: "",
        });
        await getProducts();
        toast.success("Product added successfully");
      } else {
        toast.error("Product adding failed");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      setIsLoading(true);
      const response = await axios.delete(`${API_URL}/products/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.data.status) {
        await getProducts();

        toast.success("Product deleted successfully");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = (id: number) => {
    console.log(products);
    const productToEdit = products.find((product) => product.id === id);
    if (productToEdit) {
      setIsEdit(true);
      setFormData(productToEdit);
    } else {
      console.warn(`Product with ID ${id} not found.`);
    }
  };

  const handleUpdateProduct = async () => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        `${API_URL}/products/${formData.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("response:", response);

      if (response.data.status) {
        setFormData({
          id: 0,
          title: "",
          discription: "",
          price: 0,
          file: null,
          banner_image: "",
        });
        setIsEdit(false);
        await getProducts();
        toast.success("Product updated successfully");
      } else {
        toast.error("Product updation failed");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isEdit) {
      try {
        await handleUpdateProduct();
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await handleAddProduct();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const router = useRouter();
  useEffect(() => {
    if (!authToken) {
      router.push("/auth");
    }
  }, []);

  console.log("formData:", formData);

  return (
    <>
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-6">
            <div className="card p-4">
              <h4>{isEdit ? "Edit Product" : "Add Product"} </h4>
              <form onSubmit={handleSubmit}>
                <input
                  onChange={handleOnChange}
                  value={formData.title}
                  className="form-control mb-2"
                  name="title"
                  id="title"
                  placeholder="Title"
                  required
                />
                <input
                  onChange={handleOnChange}
                  value={formData.discription}
                  id="discription"
                  className="form-control mb-2"
                  name="discription"
                  placeholder="Description"
                  required
                />
                <input
                  onChange={handleOnChange}
                  value={formData.price}
                  id="price"
                  className="form-control mb-2"
                  name="price"
                  placeholder="Cost"
                  type="number"
                  required
                />
                <div className="mb-2">
                  {formData.banner_image && (
                    <Image
                      src={formData.banner_image}
                      alt="Preview"
                      width={100}
                      height={100}
                      className="mb-2"
                    />
                  )}
                </div>
                <input
                  onChange={handleOnChange}
                  ref={fileRef}
                  className="form-control mb-2"
                  type="file"
                  id="bannerInput"
                />
                <button className="btn btn-primary" type="submit">
                  {isEdit ? "Update Product" : "Add Product"}
                </button>
              </form>
            </div>
          </div>

          <div className="col-md-6">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Banner</th>
                  <th>Cost</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{item.title}</td>
                    <td>
                      <Image
                        src={item.banner_image}
                        alt="Product"
                        width={50}
                        height={50}
                      />
                    </td>
                    <td>{item.price}</td>
                    <td>
                      <button
                        onClick={() => handleEditProduct(item.id)}
                        className="btn btn-warning btn-sm me-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(item.id)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
