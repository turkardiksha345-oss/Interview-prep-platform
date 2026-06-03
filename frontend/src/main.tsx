import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { RequireAuth } from "./components/RequireAuth";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { Practice } from "./pages/Practice";
import { MockInterview } from "./pages/MockInterview";
import { ResumeAnalyzer } from "./pages/ResumeAnalyzer";
import { Scorecard } from "./pages/Scorecard";
import { Admin } from "./pages/Admin";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<RequireAuth />}>
          <Route path="/" element={<AppShell />}>
            <Route index element={<Dashboard />} />
            <Route path="practice" element={<Practice />} />
            <Route path="scorecard" element={<Scorecard />} />
            <Route path="interviews" element={<MockInterview />} />
            <Route path="resume" element={<ResumeAnalyzer />} />
            <Route path="admin" element={<Admin />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
