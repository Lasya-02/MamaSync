import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AppRouter from "./AppRouter";
import { useAuth } from "./contexts/AuthContext";
import axios from "axios";

jest.mock("axios");
jest.mock("./contexts/AuthContext");

// Silence noisy warnings/errors
beforeAll(() => {
  jest.spyOn(console, "warn").mockImplementation((msg) => {
    if (msg.includes("React Router Future Flag Warning")) return;
    console.warn(msg);
  });
  jest.spyOn(console, "error").mockImplementation(() => {});
});

const renderWithRoute = async (route, authUser = null) => {
  useAuth.mockReturnValue({ user: authUser, login: jest.fn(), logout: jest.fn() });
  await act(async () => {
    render(
      <MemoryRouter initialEntries={[route]}>
        <AppRouter />
      </MemoryRouter>
    );
  });
};

// ---------------- PUBLIC ROUTES ----------------
test("renders Login page at '/'", async () => {
  await renderWithRoute("/", null);
  expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
});

test("renders Register page at '/register'", async () => {
  await renderWithRoute("/register", null);
  expect(screen.getByText(/create account/i)).toBeInTheDocument();
});

test("renders NotFoundPage for unknown route", async () => {
  await renderWithRoute("/random-page", null);
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
  async (route) => {
    await renderWithRoute(route, null);
    expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
  }
);

// ---------------- PROTECTED ROUTES (authenticated) ----------------
test("renders Dashboard with default tasks when API fails", async () => {
  axios.get.mockRejectedValueOnce(new Error("Network error"));
  await renderWithRoute("/dashboard", { id: "123" });
  expect(await screen.findByText(/drink 8 glasses of water/i)).toBeInTheDocument();
});

test("renders Reminder heading", async () => {
  axios.get.mockResolvedValue({ data: { reminders: [] } });
  await renderWithRoute("/reminder", { id: "123" });
  expect(await screen.findByRole("heading", { name: /health reminders/i })).toBeInTheDocument();
});

test("renders Guide and loads dropdown", async () => {
  global.fetch = jest.fn().mockResolvedValue({ json: async () => ({ documents: [] }) });
  await renderWithRoute("/guide", { id: "123" });
  expect(screen.getByText(/pregnancy guide library/i)).toBeInTheDocument();
});

test("renders CommunityForum and submits post", async () => {
  axios.get.mockResolvedValue({ data: [] });
  axios.post.mockResolvedValue({ data: { _id: "1", title: "Hello", content: "World", userId: "u1" } });
  await renderWithRoute("/community", { id: "123" });
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

  await renderWithRoute("/forum/123", { id: "123" });
  fireEvent.change(await screen.findByPlaceholderText(/write a reply/i), { target: { value: "Reply" } });
  fireEvent.submit(screen.getByRole("button", { name: /reply/i }));
  expect(axios.post).toHaveBeenCalled();
});

test("renders Hospitals heading", async () => {
  await renderWithRoute("/hospitals", { id: "123" });
  expect(screen.getByRole("heading", { name: /nearby hospitals/i })).toBeInTheDocument();
});

test("renders Profile and saves changes", async () => {
  axios.put.mockResolvedValue({});
  axios.get.mockResolvedValue({ data: { name: "Updated", email: "u@test.com" } });
  sessionStorage.setItem("userdata", JSON.stringify({ _id: "1", name: "Test", email: "test@test.com" }));
  await renderWithRoute("/profile", { id: "123" });
  fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: "Updated" } });
  fireEvent.submit(screen.getByRole("button", { name: /save changes/i }));
  expect(axios.put).toHaveBeenCalled();
});
