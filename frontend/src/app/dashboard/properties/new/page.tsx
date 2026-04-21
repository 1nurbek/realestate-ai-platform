"use client";

import { useMemo, useState } from "react";
import ImageUpload from "@/components/ImageUpload";

const featureOptions = ["Parking", "Garden", "Balcony", "Pool", "Gym", "Pet Friendly"];

export default function NewPropertyPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("Apartment");
  const [rooms, setRooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [size, setSize] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const errors = useMemo(() => {
    const list: string[] = [];
    if (!title.trim()) list.push("Title is required.");
    if (!description.trim()) list.push("Description is required.");
    if (!price || Number(price) <= 0) list.push("Price must be greater than 0.");
    if (!address.trim()) list.push("Address is required.");
    if (!city.trim()) list.push("City is required.");
    if (!rooms || Number(rooms) <= 0) list.push("Rooms must be greater than 0.");
    if (!bathrooms || Number(bathrooms) <= 0) list.push("Bathrooms must be greater than 0.");
    if (!size || Number(size) <= 0) list.push("Size must be greater than 0.");
    return list;
  }, [title, description, price, address, city, rooms, bathrooms, size]);

  const toggleFeature = (value: string) => {
    setFeatures((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Add Property</h1>
        <p className="mt-2 text-slate-600">Create a new listing with complete details and media.</p>
      </header>

      <form
        className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
          if (!errors.length) {
            alert("Property submitted (mock).");
          }
        }}
      >
        {submitted && errors.length > 0 ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            <p className="font-semibold">Please fix the following:</p>
            <ul className="mt-1 list-disc pl-5">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Basic Information</h2>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
          <input
            type="number"
            placeholder="Price (USD)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Location</h2>
          <input
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
          <input
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <option>Apartment</option>
              <option>House</option>
              <option>Condo</option>
              <option>Villa</option>
            </select>
            <input
              type="number"
              placeholder="Rooms"
              value={rooms}
              onChange={(e) => setRooms(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
            <input
              type="number"
              placeholder="Bathrooms"
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
            <input
              type="number"
              placeholder="Size (sqft)"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Features</h2>
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            {featureOptions.map((option) => (
              <label key={option} className="flex items-center gap-2 rounded-md border border-slate-200 p-2 text-sm">
                <input
                  type="checkbox"
                  checked={features.includes(option)}
                  onChange={() => toggleFeature(option)}
                  className="h-4 w-4 accent-indigo-600"
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Images
          </label>
          <ImageUpload onChange={setUploadedFiles} />
        </div>

        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Submit Property
        </button>
      </form>
    </section>
  );
}