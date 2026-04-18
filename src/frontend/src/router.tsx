import { Layout } from "@/components/Layout";
import { AdminPage } from "@/pages/AdminPage";
import { HomePage } from "@/pages/HomePage";
import { ProjectDetailPage } from "@/pages/ProjectDetailPage";
import { ProjectsPage } from "@/pages/ProjectsPage";
import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

// Root layout route
const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const projectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projects",
  component: ProjectsPage,
});

const projectDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projects/$id",
  component: ProjectDetailPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const adminNewProjectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/projects/new",
  component: AdminPage,
});

const adminEditProjectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/projects/$id/edit",
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  projectsRoute,
  projectDetailRoute,
  adminRoute,
  adminNewProjectRoute,
  adminEditProjectRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
