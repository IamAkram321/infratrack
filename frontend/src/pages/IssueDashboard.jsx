import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { fetchIssues, updateIssueStatus } from "../api/issues";

// Severity badge styles
const severityStyles = {
  high: "bg-red-100 text-red-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-green-100 text-green-700",
};

function IssueDashboard() {
  const [page, setPage] = useState(1);
  const [severity, setSeverity] = useState("");
  const [status, setStatus] = useState("");

  // 🔐 ROLE CHECK (KEY PART)
  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";

  const queryClient = useQueryClient();

  // Fetch issues
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

  // Update issue status mutation (ADMIN ONLY)
  const statusMutation = useMutation({
    mutationFn: updateIssueStatus,
    onSuccess: () => {
      queryClient.invalidateQueries(["issues"]);
    },
  });

  if (isLoading) {
    return (
      <p className="text-center mt-10 text-gray-600">
        Loading issues...
      </p>
    );
  }

  if (isError) {
    return (
      <div className="text-center mt-10 text-red-600">
        <p className="text-lg font-medium">
          Unable to load issues
        </p>
        <p className="text-sm mt-1">
          Please check your connection and try again.
        </p>
      </div>
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
          <div className="text-center text-gray-500 py-10">
            <p className="text-lg font-medium">
              No issues found
            </p>
            <p className="text-sm mt-1">
              Try adjusting filters or report a new issue.
            </p>
          </div>
        )}

        {issues.map((issue) => {
          const isUpdating =
            isAdmin &&
            statusMutation.isLoading &&
            statusMutation.variables?.id === issue._id;

          return (
            <div
              key={issue._id}
              className="bg-white p-4 rounded shadow"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold capitalize">
                  {issue.type.replace("_", " ")}
                </h3>

                <span
                  className={`text-xs px-2 py-1 rounded font-medium ${
                    severityStyles[issue.severity] ||
                    "bg-gray-100 text-gray-600"
                  }`}
                >
                  {(issue.severity || "unknown").toUpperCase()}
                </span>
              </div>

              <p className="text-gray-700 mt-2">
                📍 {issue.location}
              </p>

              {/* STATUS SECTION */}
              <div className="mt-3 flex items-center gap-2">
                <label className="text-sm text-gray-600">
                  Status:
                </label>

                {/* 👑 ADMIN: editable */}
                {isAdmin ? (
                  <>
                    <select
                      value={issue.status}
                      disabled={isUpdating}
                      onChange={(e) =>
                        statusMutation.mutate({
                          id: issue._id,
                          status: e.target.value,
                        })
                      }
                      className="border px-2 py-1 rounded text-sm disabled:opacity-60"
                    >
                      <option value="reported">Reported</option>
                      <option value="in_progress">
                        In Progress
                      </option>
                      <option value="fixed">Fixed</option>
                    </select>

                    {isUpdating && (
                      <span className="text-xs text-gray-400">
                        Updating...
                      </span>
                    )}
                  </>
                ) : (
                  // 👤 USER: read-only
                  <span className="text-sm text-gray-700 capitalize">
                    {issue.status.replace("_", " ")}
                  </span>
                )}
              </div>
            </div>
          );
        })}
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
