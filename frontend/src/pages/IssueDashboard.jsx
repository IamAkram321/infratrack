import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchIssues } from "../api/issues";

function IssueDashboard() {
  const [page, setPage] = useState(1);
  const [severity, setSeverity] = useState("");
  const [status, setStatus] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["issues", page, severity, status],
    queryFn: () =>
      fetchIssues({
        page,
        limit: 5,
        severity: severity || undefined,
        status: status || undefined,
      }),
    keepPreviousData: true,
  });

  if (isLoading) {
    return <p className="text-center mt-10">Loading issues...</p>;
  }

  if (isError) {
    return (
      <p className="text-center mt-10 text-red-600">
        Failed to load issues
      </p>
    );
  }

  const issues = data.data;
  const meta = data.meta;

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        Infrastructure Issues
      </h2>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={severity}
          onChange={(e) => {
            setPage(1);
            setSeverity(e.target.value);
          }}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Severities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
          className="border px-3 py-2 rounded"
        >
          <option value="">Active Issues</option>
          <option value="reported">Reported</option>
          <option value="in_progress">In Progress</option>
          <option value="fixed">Fixed</option>
        </select>
      </div>

      {/* Issue List */}
      <div className="space-y-4">
        {issues.length === 0 && (
          <p className="text-gray-600">No issues found.</p>
        )}

        {issues.map((issue) => (
          <div
            key={issue._id}
            className="bg-white p-4 rounded shadow"
          >
            <div className="flex justify-between">
              <h3 className="font-semibold capitalize">
                {issue.type.replace("_", " ")}
              </h3>
              <span className="text-sm text-gray-500">
                {issue.severity.toUpperCase()}
              </span>
            </div>

            <p className="text-gray-700 mt-1">
              📍 {issue.location}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Status: {issue.status}
            </p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-8">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-sm text-gray-600">
          Page {meta.page} of {meta.pages}
        </span>

        <button
          disabled={page === meta.pages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default IssueDashboard;
