import { GitHubBanner, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import { dataProvider } from "./providers/data";
import Dashboard from "./pages/dashboard";
import { Outlet } from "react-router";
import {Layout} from "@/components/refine-ui/layout/layout"
import { Home, BookOpen } from "lucide-react";
import SubjectList from "./pages/subject/list";
import SubjectsCreate from "./pages/subject/create";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              notificationProvider={useNotificationProvider()}
              routerProvider={routerProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "h4y4ij-6uISnY-EqhjFK",
              }}

              //resources = sidebar options [telling refine what features you have (exp: dashboard, subjects)]
              resources={[
                  {
                      name: 'dashboard',    // name of this page
                      list: '/',            // route of this page
                      meta: {label: 'Home', icon: <Home />}     // at sidebar, put this page as 'Home', with Home icon
                  },
                  {
                      name: 'subjects',
                      list: '/subjects',
                      create: '/subjects/create',
                      meta: {label: 'Subjects', icon: <BookOpen />}
                  }
              ]}
            >

                <Routes> {/* contains all the routes in website */}
                    <Route
                        element={
                            <Layout>
                                <Outlet />  {/* Current page will be rendered here [exp: dashboard, SubjectList] */}
                            </Layout>
                        }
                    >
                        <Route path="/" element={<Dashboard />} />      {/* homepage */}

                        <Route path="subjects">
                            <Route index element={<SubjectList />} /> {/* show <SubjectList /> from list.tsx */}
                            <Route path="create" element={<SubjectsCreate />} />  {/* show <SubjectCreate /> from create.tsx */}
                        </Route>
                    </Route>
                </Routes>
              <Toaster />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
