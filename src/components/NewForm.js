import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { credentialState } from "../Atoms";

const NewForm = ({ code }) => {
  const [user, setUser] = useState({ name: "", email: "" });
  //const mailchimp_code = localStorage.removeItem("mailchimp_code");

  const credentials = useRecoilValue(credentialState)
  console.log('cre', credentials);

  const data = {
      name:user.name,
      email: user.email,
      code: credentials.code
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (data) {
      fetch("http://localhost/mailchimp-php/saveUser.php", {
        method: "POST",
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((data) => {
         localStorage.removeItem('mailchimp_code')
        });
    }
  };

  return (
    <div className="w-full max-w-md">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
        <h1 className="text-center text-2xl font-bold py-5">Save User Data</h1>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="id"
          >
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="id"
            type="text"
            name="name"
            placeholder="name"
            onChange={(e) =>
              setUser({ ...user, [e.target.name]: e.target.value })
            }
          />
        </div>
        <div className="mb-6">
          <label
            className="block uppercase text-gray-700 text-sm font-bold mb-2"
            htmlFor="secret"
          >
            email
          </label>
          <input
            className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="secret"
            type="email"
            name="email"
            onChange={(e) =>
              setUser({ ...user, [e.target.name]: e.target.value })
            }
            placeholder="email"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
            name="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewForm;
