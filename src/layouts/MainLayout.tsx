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
import { SearchModal } from "../components/SearchModal/SearchModal";

export function MainLayout(): JSX.Element {
  const { user, isAuthorized } = useAppSelector((state) => state.user);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.openAuthModal) {
      setIsAuthModalOpen(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  function openSearchModal(): void {
    setIsSearchModalOpen(true);
  }

  function closeSearchModal(): void {
    setIsSearchModalOpen(false);
  }

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
          <Link to="/" className="logo">
            MovieLib
          </Link>

          <nav className="navigation">
            <NavLink to="/genres" className="navigation__link">
              Genres
            </NavLink>
            <button
              type="button"
              className="navigation__link navigation__button"
              onClick={openSearchModal}
            >
              Search
            </button>
          </nav>

          {isAuthorized && user ? (
            <Link to="/profile" className="auth-button auth-button_link">
              {user.surname}
            </Link>
          ) : (
            <button
              type="button"
              className="auth-button"
              onClick={openAuthModal}
            >
              Sign in
            </button>
          )}
        </div>
      </header>

      <main className="main">
        <div className="container">
          <Outlet />
        </div>
      </main>

      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
      <SearchModal isOpen={isSearchModalOpen} onClose={closeSearchModal} />
    </div>
  );
}
