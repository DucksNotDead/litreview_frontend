import { Navigate, Route, Routes } from "react-router-dom";

import { pages, routes } from "@/pages";
import { Header } from "@/components/Header.tsx";

export function App() {
  return (
    <>
      <Header />
      <div className={"flex justify-center"}>
        <div className={"w-full px-6"} style={{ maxWidth: 1024 }}>
          <Routes>
            <Route element={<Navigate to={pages.books} />} path="/" />
            {routes.map((route) => (
              <Route
                key={route.path}
                element={route.component}
                path={route.path}
              />
            ))}
          </Routes>
        </div>
      </div>
    </>
  );
}
