import { Authenticated, Refine } from "@refinedev/core";
import { DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

// Import React Router support for Refine
import routerProvider, {
    DocumentTitleHandler,
    NavigateToResource,
    UnsavedChangesNotifier,
} from "@refinedev/react-router";

// Import React Router
import { BrowserRouter, Outlet, Route, Routes } from "react-router";

// Import CSS
import "./App.css";

// Import notification and theme
import { Toaster } from "./components/refine-ui/notification/toaster";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";

// Import sidebar icons
import {
    BookOpen,
    Building2,
    ClipboardCheck,
    GraduationCap,
    Home,
    Users,
} from "lucide-react";

// Import all pages
import SubjectsList from "./pages/subjects/list";
import SubjectsCreate from "./pages/subjects/create";
import SubjectsShow from "./pages/subjects/show";

import Dashboard from "./pages/dashboard";

import ClassesList from "./pages/classes/list";
import ClassesCreate from "./pages/classes/create";
import ClassesShow from "./pages/classes/show";

import DepartmentsList from "./pages/departments/list";
import DepartmentsCreate from "./pages/departments/create";
import DepartmentShow from "./pages/departments/show";

import FacultyList from "./pages/faculty/list";
import FacultyShow from "./pages/faculty/show";

import EnrollmentsCreate from "./pages/enrollments/create";
import EnrollmentsJoin from "./pages/enrollments/join";
import EnrollmentConfirm from "./pages/enrollments/confirm";

import { Login } from "./pages/login";
import { Register } from "./pages/register";

// Import shared layout
import { Layout } from "./components/refine-ui/layout/layout";

// Import backend providers
import { dataProvider } from "./providers/data";
import { authProvider } from "./providers/auth";

function App() {
  return (
    <BrowserRouter>     // Enable browser routing
      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}       // Handles all API requests
              authProvider={authProvider}       // Handles login/logout/authentication
              notificationProvider={useNotificationProvider()}      // Shows popup notifications
              routerProvider={routerProvider}       // Connect Refine with React Router
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "h4y4ij-6uISnY-EqhjFK",
              }}

              //resources = sidebar options [telling refine what features you have (exp: dashboard, subjects)]
              resources={[
                  {
                      name: "dashboard",  // name of page
                      list: "/",            // route of page
                      meta: {               // at sidebar, put "Home" option, and home icon
                          label: "Home",
                          icon: <Home />,
                      },
                  },
                  {
                      name: "subjects",
                      list: "/subjects",
                      create: "/subjects/create",  // add a new subject
                      show: "/subjects/show/:id",   // view subject's details
                      meta: {
                          label: "Subjects",
                          icon: <BookOpen />,
                      },
                  },
                  {
                      name: "departments",
                      list: "/departments",
                      show: "/departments/show/:id",
                      create: "/departments/create",
                      meta: {
                          label: "Departments",
                          icon: <Building2 />,
                      },
                  },
                  {
                      name: "users",
                      list: "/faculty",
                      show: "/faculty/show/:id",
                      meta: {
                          label: "Faculty",
                          icon: <Users />,
                      },
                  },
                  {
                      name: "enrollments",
                      list: "/enrollments/create",
                      create: "/enrollments/create",
                      meta: {
                          label: "Enrollments",
                          icon: <ClipboardCheck />,
                      },
                  },
                  {
                      name: "classes",
                      list: "/classes",
                      create: "/classes/create",
                      show: "/classes/show/:id",
                      meta: {
                          label: "Classes",
                          icon: <GraduationCap />,
                      },
                  },
              ]}
            >

                {/* All application routes */}
                <Routes>

                    {/* Public routes (no login needed) */}
                    <Route
                        element={
                            <Authenticated
                                key="public-routes"
                                fallback={<Outlet />}
                            >
                                {/* If already logged in, go to dashboard */}
                                <NavigateToResource fallbackTo="/" />
                            </Authenticated>
                        }
                    >
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Route>

                    {/* Protected routes (login required) */}
                    <Route
                        element={
                            <Authenticated
                                key="private-routes"
                                fallback={<Login />}
                            >
                                {/* Shared layout (sidebar + navbar) */}
                                <Layout>
                                    <Outlet />
                                </Layout>
                            </Authenticated>
                        }
                    >

                        {/* Dashboard */}
                        <Route path="/" element={<Dashboard />} />

                        {/* Subject pages */}
                        <Route path="subjects">
                            <Route index element={<SubjectsList />} />
                            <Route path="create" element={<SubjectsCreate />} />
                            <Route path="show/:id" element={<SubjectsShow />} />
                        </Route>

                        {/* Department pages */}
                        <Route path="departments">
                            <Route index element={<DepartmentsList />} />
                            <Route path="create" element={<DepartmentsCreate />} />
                            <Route path="show/:id" element={<DepartmentShow />} />
                        </Route>

                        {/* Faculty pages */}
                        <Route path="faculty">
                            <Route index element={<FacultyList />} />
                            <Route path="show/:id" element={<FacultyShow />} />
                        </Route>

                        {/* Enrollment pages */}
                        <Route path="enrollments">
                            <Route path="create" element={<EnrollmentsCreate />} />
                            <Route path="join" element={<EnrollmentsJoin />} />
                            <Route path="confirm" element={<EnrollmentConfirm />} />
                        </Route>

                        {/* Class pages */}
                        <Route path="classes">
                            <Route index element={<ClassesList />} />
                            <Route path="create" element={<ClassesCreate />} />
                            <Route path="show/:id" element={<ClassesShow />} />
                        </Route>

                    </Route>
                </Routes>

                {/* Notification popup */}
                <Toaster />

                {/* Ctrl+K search */}
                <RefineKbar />

                {/* Warn before leaving unsaved changes */}
                <UnsavedChangesNotifier />

                {/* Change browser tab title */}
                <DocumentTitleHandler />

            </Refine>
          </DevtoolsProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;