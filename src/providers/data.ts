import { createDataProvider, CreateDataProviderOptions } from "@refinedev/rest";

import { CreateResponse, GetOneResponse, ListResponse } from "@/types";
import { BACKEND_BASE_URL } from "@/constants";


const options: CreateDataProviderOptions = {
  getList: {  // Builds the API endpoint URL
    getEndpoint: ({ resource }) => resource,

    // Builds query parameters (exp: ?page=1&limit=10)
    buildQueryParams: async ({ resource, pagination, filters }) => {
      const params: Record<string, string | number> = {};

      // Adds pagination (page number and items per page)
      if (pagination?.mode !== "off") {
        const page = pagination?.currentPage ?? 1;  // Default: page 1
        const pageSize = pagination?.pageSize ?? 10;  // Default: 10 items

        params.page = page;
        params.limit = pageSize;
      }

      // Handles filtering based on the resource type
      filters?.forEach((filter) => {

        // Examples of different filtering rules:
        const field = "field" in filter ? filter.field : "";    // For users
        const value = String(filter.value);   // Search by name/code

        if (field === "role") {   // For users
          params.role = value;
        }

        if (resource === "departments") { // Search by name/code
          if (field === "name" || field === "code") params.search = value;
        }

        if (resource === "users") { // Search user
          if (field === "search" || field === "name" || field === "email") {
            params.search = value;
          }
        }

        if (resource === "subjects") {
          if (field === "department") params.department = value;    // Filter by department
          if (field === "name" || field === "code") params.search = value;
        }

        if (resource === "classes") {
          if (field === "name") params.search = value;
          if (field === "subject") params.subject = value;
          if (field === "teacher") params.teacher = value;  // Filter by teacher
        }
      });

      return params;
    },

    // Converts backend response to frontend format
    mapResponse: async (response) => {
      const payload: ListResponse = await response.json();
      return payload.data ?? [];  // Returns empty array if no data
    },

    // Gets total number of items (for pagination)
    getTotalCount: async (response) => {
      const payload: ListResponse = await response.json();
      return payload.pagination?.total ?? payload.data?.length ?? 0;
    },
  },

  create: {
    getEndpoint: ({ resource }) => resource,  // URL: /users or /departments

    buildBodyParams: async ({ variables }) => variables,  // Sends data as-is

    mapResponse: async (response) => {
      const json: CreateResponse = await response.json();
      return json.data ?? {};   // Returns empty object if no data
    },
  },

  getOne: {
    getEndpoint: ({ resource, id }) => `${resource}/${id}`, // URL: /users/123

    mapResponse: async (response) => {
      const json: GetOneResponse = await response.json();
      return json.data ?? {};   // Returns empty object if no data
    },
  },
};

// Creating and Exporting the Provider
const { dataProvider } = createDataProvider(BACKEND_BASE_URL, options);

export { dataProvider };
