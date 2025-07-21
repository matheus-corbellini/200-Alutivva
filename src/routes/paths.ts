export const routes = {
  landingPage: "/",
  login: "/login",
  register: "/register",
  marketplace: "/marketplace",
  property: "/property/:id",
  propertyDetails: (id: number) => `/property/${id}`,
};
