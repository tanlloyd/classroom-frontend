// Icons, React state, Refine table hook, and table column types
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";

// UI components used for dropdown, badges, input, layout, buttons, table
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ListView } from "@/components/refine-ui/views/list-view";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ShowButton } from "@/components/refine-ui/buttons/show";

// Subject type and department dropdown options
import { Subject } from "@/types";
import { DEPARTMENT_OPTIONS } from "@/constants";

const SubjectListPage = () => {
    // Stores what the user types in the search box
    const [searchQuery, setSearchQuery] = useState("");

    // Stores selected department filter
    // Default is "all", meaning no department filter
    const [selectedDepartment, setSelectedDepartment] = useState<string>("all");

    // Defines the table columns: Code, Name, Department, Description, Details button
    // useMemo means: only create these columns once, not every re-render
    const subjectColumns = useMemo<ColumnDef<Subject>[]>(
        () => [
            {
                id: "code",
                accessorKey: "code",
                size: 100,
                header: () => <p className="column-title ml-2">Code</p>,
                cell: ({ getValue }) => <Badge>{getValue<string>()}</Badge>,
            },
            {
                id: "name",
                accessorKey: "name",
                size: 200,
                header: () => <p className="column-title">Name</p>,
                cell: ({ getValue }) => (
                    <span className="text-foreground">{getValue<string>()}</span>
                ),
                filterFn: "includesString",
            },
            {
                id: "department",
                accessorKey: "department.name",
                size: 150,
                header: () => <p className="column-title">Department</p>,
                cell: ({ getValue }) => (
                    <Badge variant="secondary">{getValue<string>()}</Badge>
                ),
            },
            {
                id: "description",
                accessorKey: "description",
                size: 300,
                header: () => <p className="column-title">Description</p>,
                cell: ({ getValue }) => (
                    <span className="truncate line-clamp-2">{getValue<string>()}</span>
                ),
            },
            {
                id: "details",
                size: 140,
                header: () => <p className="column-title">Details</p>,
                cell: ({ row }) => (
                    <ShowButton
                        resource="subjects"
                        recordItemId={row.original.id}
                        variant="outline"
                        size="sm"
                    >
                        View
                    </ShowButton>
                ),
            },
        ],
        []
    );

    // Creates department filter for API/table
    // If "all" is selected, no filter is applied
    const departmentFilters =
        selectedDepartment === "all"
            ? []
            : [
                {
                    field: "department",
                    operator: "eq" as const,
                    value: selectedDepartment,
                },
            ];

    // Creates search filter for API/table
    // If search box is empty, no search filter is applied
    const searchFilters = searchQuery
        ? [
            {
                field: "name",
                operator: "contains" as const,
                value: searchQuery,
            },
        ]
        : [];

    // Connects Refine table to the "subjects" resource (call Subjects API resource, then read "Subject" table)
    // This is where Refine fetches subject data from backend
    // It also controls:
    // - columns
    // - pagination
    // - filters
    // - sorting

    const subjectTable = useTable<Subject>({
        columns: subjectColumns,
        refineCoreProps: {
            resource: "subjects",
            pagination: {
                pageSize: 10,       // 10 subjects per page
                mode: "server",
            },
            filters: {
                // Compose refine filters from the current UI selections.
                permanent: [...departmentFilters, ...searchFilters],
            },
            sorters: {
                initial: [
                    {
                        field: "id",
                        order: "desc",
                    },
                ],
            },
        },
    });

    return (
        <ListView>
            {/* Shows breadcrumb navigation, e.g. Home / Subjects */}
            <Breadcrumb />

            {/* Page title */}
            <h1 className="page-title">Subjects</h1>

            <div className="intro-row">
                <p>Quick access to essential metrics and management tools.</p>

                <div className="actions-row">
                    <div className="search-field">
                        <Search className="search-icon" />
                        <Input
                            type="text"
                            placeholder="Search by name..."
                            className="pl-10 w-full"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                        />
                    </div>

                    {/* Department dropdown + create button */}
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Select
                            value={selectedDepartment}
                            onValueChange={setSelectedDepartment}
                        >
                            <SelectTrigger className="">
                                <SelectValue placeholder="Filter by department" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="all">All Departments</SelectItem>
                                {/* Creates dropdown options from DEPARTMENT_OPTIONS */}
                                {DEPARTMENT_OPTIONS.map((department) => (
                                    <SelectItem key={department.value} value={department.value}>
                                        {department.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Button that goes to /subjects/create */}
                        <CreateButton resource="subjects" />
                    </div>
                </div>
            </div>

            {/* Displays the subject table */}
            <DataTable table={subjectTable} />
        </ListView>
    );
};

export default SubjectListPage;
