import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createIssue } from "../api/issues";

function ReportIssue() {
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: createIssue,
    onSuccess: () => {
      setType("");
      setLocation("");
      setError("");
    },
    onError: (err) => {
      setError(
        err?.response?.data?.message || "Something went wrong"
      );
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!type || !location) {
      setError("All fields are required");
      return;
    }

    mutation.mutate({ type, location });
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">
        Report Infrastructure Issue
      </h2>

      {error && (
        <p className="text-red-600 mb-3 text-sm">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Issue Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select issue type</option>
            <option value="pothole">Pothole</option>
            <option value="streetlight">Streetlight</option>
            <option value="electric_pole">Electric Pole</option>
            <option value="manhole">Manhole</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. MG Road, Bangalore"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={mutation.isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
        >
          {mutation.isLoading ? "Submitting..." : "Report Issue"}
        </button>
      </form>

      {mutation.isSuccess && (
        <p className="text-green-600 mt-4 text-sm">
          Issue reported successfully
        </p>
      )}
    </div>
  );
}

export default ReportIssue;
