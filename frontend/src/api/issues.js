import apiClient from "./client";

export const createIssue = async (issueData) => {
  const response = await apiClient.post("/issues", issueData);
  return response.data;
};

export const fetchIssues = async (params) => {
  const response = await apiClient.get("/issues", {
    params,
  });
  return response.data;
};

export const updateIssueStatus = async ({ id, status }) => {
  const response = await apiClient.patch(
    `/issues/${id}/status`,
    { status }
  );
  return response.data;
};
