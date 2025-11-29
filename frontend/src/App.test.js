import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AppRouter from "./AppRouter";
import { useAuth } from "./contexts/AuthContext";
import axios from "axios";

jest.mock("axios");

describe("App Routing", () => {
  const renderWithRoute = (route) => {
    return render(
      <MemoryRouter initialEntries={[route]}>
        <AppRouter />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // PUBLIC ROUTES
  test("renders Login page at '/'", () => {
    useAuth.mockReturnValue({ user: null });
    renderWithRoute("/");
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
  });

  test("renders Register page at '/register'", () => {
    useAuth.mockReturnValue({ user: null });
    renderWithRoute("/register");
    expect(screen.getByText(/create account/i)).toBeInTheDocument();
  });

  // PROTECTED ROUTES (redirect)
  const protectedRoutes = [
    "/dashboard",
    "/reminder",
    "/guide",
    "/community",
    "/forum/123",
    "/hospitals",
    "/profile",
    "/sos",
  ];

  test.each(protectedRoutes)(
    "redirects to '/' when accessing %s without login",
    (route) => {
      useAuth.mockReturnValue({ user: null });
      renderWithRoute(route);
      expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    }
  );

  // PROTECTED ROUTES (logged in)
  test("renders Dashboard when logged in", () => {
    useAuth.mockReturnValue({ user: { id: "123" } });
    renderWithRoute("/dashboard");
    expect(screen.getByRole("heading", { name: /mamasync/i })).toBeInTheDocument();
  });

  test("renders Reminder page when logged in", async () => {
  useAuth.mockReturnValue({ user: { id: "123" } });

  axios.get.mockResolvedValue({ data: [] });

  renderWithRoute("/reminder");

  expect(
    await screen.findByRole("heading", { name: /health reminders/i })
  ).toBeInTheDocument();
});

  test("renders Guide page when logged in", () => {
    useAuth.mockReturnValue({ user: { id: "123" } });
    renderWithRoute("/guide");
    expect(
      screen.getByRole("heading", { name: /pregnancy guide library/i })
    ).toBeInTheDocument();
  });

  test("renders Community Forum when logged in", async () => {
    useAuth.mockReturnValue({ user: { id: "123" } });

    axios.get.mockResolvedValue({ data: [] });

    renderWithRoute("/community");

    expect(
      screen.getByRole("heading", { name: /community forum/i })
    ).toBeInTheDocument();
  });

  test("renders Forum Detail page when logged in", async () => {
  useAuth.mockReturnValue({ user: { id: "123" } });

  axios.get
    .mockResolvedValueOnce({
      data: {
        title: "Test Post",
        content: "Hello world",
        userId: "User1",
        created_at: "2024-01-01T00:00:00Z"
      }
    })
    .mockResolvedValueOnce({
      data: [
        {
          id: 1,
          userId: "User1",
          content: "Nice!",
          created_at: "2024-01-01T00:00:00Z"
        }
      ]
    });

  renderWithRoute("/forum/123");

  expect(await screen.findByText(/nice/i)).toBeInTheDocument();
});



  test("renders Hospitals page when logged in", () => {
    useAuth.mockReturnValue({ user: { id: "123" } });
    renderWithRoute("/hospitals");
    expect(
      screen.getByRole("heading", { level: 2, name: /nearby hospitals/i })
    ).toBeInTheDocument();
  });

  test("renders Profile page when logged in", () => {
    useAuth.mockReturnValue({ user: { id: "123" } });
    renderWithRoute("/profile");
    expect(screen.getByText(/profile/i)).toBeInTheDocument();
  });

  test("renders SOS page when logged in", () => {
    useAuth.mockReturnValue({ user: { id: "123" } });
    renderWithRoute("/sos");
    expect(screen.getByText(/sos/i)).toBeInTheDocument();
  });

  // 404 PAGE
  test("renders NotFoundPage for unknown route", () => {
    useAuth.mockReturnValue({ user: null });
    renderWithRoute("/random-page");
    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
  });
});
