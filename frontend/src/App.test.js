import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AppRouter from "./AppRouter";
import { useAuth } from "./contexts/AuthContext";
import axios from "axios";

jest.mock("axios");
jest.mock("./contexts/AuthContext");

const renderWithRoute = (route, authUser = null) => {
  useAuth.mockReturnValue({ user: authUser, login: jest.fn(), logout: jest.fn() });
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AppRouter />
    </MemoryRouter>
  );
};

beforeEach(() => {
  jest.clearAllMocks();
});

// ---------------- PUBLIC ROUTES ----------------
test("renders Login page at '/'", () => {
  renderWithRoute("/", null);
  expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
});

test("renders Register page at '/register'", () => {
  renderWithRoute("/register", null);
  expect(screen.getByText(/create account/i)).toBeInTheDocument();
});

test("renders NotFoundPage for unknown route", () => {
  renderWithRoute("/random-page", null);
  expect(screen.getByText(/page not found/i)).toBeInTheDocument();
});

// ---------------- PROTECTED ROUTES (unauthenticated redirect) ----------------
const protectedRoutes = [
  "/dashboard",
  "/reminder",
  "/guide",
  "/community",
  "/forum/123",
  "/hospitals",
  "/profile"
];

test.each(protectedRoutes)(
  "redirects to login when accessing %s without auth",
  (route) => {
    renderWithRoute(route, null);
    expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
  }
);

// ---------------- PROTECTED ROUTES (authenticated) ----------------
test("renders Dashboard when logged in", async () => {
  axios.get.mockRejectedValueOnce(new Error("Network error"));
  renderWithRoute("/dashboard", { id: "123" });
  expect(await screen.findByText(/drink 8 glasses of water/i)).toBeInTheDocument();
});

test("renders Reminder when logged in", async () => {
  axios.get.mockResolvedValue({ data: { reminders: [] } });
  renderWithRoute("/reminder", { id: "123" });
  expect(await screen.findByRole("heading", { name: /health reminders/i })).toBeInTheDocument();
});

test("renders Guide when logged in", () => {
  global.fetch = jest.fn().mockResolvedValue({ json: async () => ({ documents: [] }) });
  renderWithRoute("/guide", { id: "123" });
  expect(screen.getByText(/pregnancy guide library/i)).toBeInTheDocument();
});

test("renders CommunityForum and submits post", async () => {
  axios.get.mockResolvedValue({ data: [] });
  axios.post.mockResolvedValue({ data: { _id: "1", title: "Hello", content: "World", userId: "u1" } });
  renderWithRoute("/community", { id: "123" });
  fireEvent.change(screen.getByPlaceholderText(/post title/i), { target: { value: "Hello" } });
  fireEvent.change(screen.getByPlaceholderText(/write your post/i), { target: { value: "World" } });
  fireEvent.submit(screen.getByRole("button", { name: /post/i }));
  expect(axios.post).toHaveBeenCalled();
});

test("renders PostDetail and submits reply", async () => {
  axios.get
    .mockResolvedValueOnce({ data: { title: "Test", content: "Hello", userId: "u1", created_at: "2024-01-01" } })
    .mockResolvedValueOnce({ data: [] });
  axios.post.mockResolvedValueOnce({ data: { id: 1, userId: "u1", content: "Reply", created_at: "2024-01-01" } });

  renderWithRoute("/forum/123", { id: "123" });
  fireEvent.change(await screen.findByPlaceholderText(/write a reply/i), { target: { value: "Reply" } });
  fireEvent.submit(screen.getByRole("button", { name: /reply/i }));
  expect(axios.post).toHaveBeenCalled();
});

test("renders Hospitals when logged in", () => {
  renderWithRoute("/hospitals", { id: "123" });
  expect(screen.getByRole("heading", { name: /nearby hospitals/i })).toBeInTheDocument();
});

test("renders Profile when logged in", () => {
  renderWithRoute("/profile", { id: "123" });
  expect(screen.getByText(/account profile/i)).toBeInTheDocument();
});
