import React, { useState } from "react";
import { X } from "lucide-react";

const AddressForm = ({ onSave, onCancel, initialAddress = null }) => {
  const [address, setAddress] = useState(
    initialAddress || {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      phone: "",
      isDefault: false,
    }
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddress({
      ...address,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !address.street ||
      !address.city ||
      !address.state ||
      !address.postalCode ||
      !address.phone
    ) {
      alert("Please fill all fields");
      return;
    }
    onSave(address);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <h3 className="text-xl font-semibold text-white mb-4">
        {initialAddress ? "Edit Address" : "Add New Address"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="street"
          placeholder="Street Address"
          value={address.street}
          onChange={handleChange}
          className="col-span-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-emerald-500 focus:outline-none"
        />

        <input
          type="text"
          name="city"
          placeholder="City"
          value={address.city}
          onChange={handleChange}
          className="bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-emerald-500 focus:outline-none"
        />

        <input
          type="text"
          name="state"
          placeholder="State"
          value={address.state}
          onChange={handleChange}
          className="bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-emerald-500 focus:outline-none"
        />

        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          value={address.postalCode}
          onChange={handleChange}
          className="bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-emerald-500 focus:outline-none"
        />

        <input
          type="text"
          name="country"
          placeholder="Country"
          value={address.country}
          onChange={handleChange}
          className="bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-emerald-500 focus:outline-none"
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={address.phone}
          onChange={handleChange}
          className="bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-emerald-500 focus:outline-none"
        />
      </div>

      <label className="flex items-center gap-2 mt-4 cursor-pointer">
        <input
          type="checkbox"
          name="isDefault"
          checked={address.isDefault}
          onChange={handleChange}
          className="w-4 h-4 rounded"
        />
        <span className="text-gray-300">Set as default address</span>
      </label>

      <div className="flex gap-3 mt-6">
        <button
          type="submit"
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded transition"
        >
          Save Address
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddressForm;
