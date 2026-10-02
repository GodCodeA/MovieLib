import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAppSelector } from "../hooks/redux";
import { useEffect, useState } from "react";
import { AuthModal } from "../components/AuthModal/AuthModal";
import { MonkeyMascot } from "../components/MonkeyMascot/MonkeyMascot";

export function MainLayout(): JSX.Element {
  const { user, isAuthorized } = useAppSelector((state) => state.user);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.openAuthModal) {
      setIsAuthModalOpen(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  function openAuthModal(): void {
    setIsAuthModalOpen(true);
  }

  function closeAuthModal(): void {
    setIsAuthModalOpen(false);
  }

  return (
    <div className="app">
      <header className="header">
        <div className="container header__content">
          <div className="header__brand">
            <Link to="/" className="logo">
              <img
                className="logo__background"
                src="/logoBg.svg"
                alt="MovieLib background"
              />
              <span className="logo__text">MovieLib</span>
            </Link>
            <MonkeyMascot />
          </div>

          <nav className="navigation">
            <NavLink to="/genres" className="navigation__link">
              Genres
            </NavLink>
            <div className="header__search">
              <NavLink to="/movies" className="navigation__link">
                Search
              </NavLink>
            </div>
          </nav>

          {isAuthorized && user ? (
            <Link to="/profile" className="auth-button auth-button_link">
              {user.surname}
            </Link>
          ) : (
            <button
              type="button"
              className="auth-button btn btn-auth"
              onClick={openAuthModal}
            >
              Sign up
            </button>
          )}
        </div>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container footer__content">
          <div className="footer__brand">
            <Link to="/" className="logo">
              <img
                className="logo__background"
                src="/logoBg.svg"
                alt="MovieLib background"
              />
              <span className="logo__text">MovieLib</span>
            </Link>
            <MonkeyMascot />
          </div>
        </div>
      </footer>
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </div>
  );
}
