import { FormEvent, PointerEvent, useEffect, useState } from "react";
import { loginUser, registerUser } from "../../api/authApi";
import { useAppDispatch } from "../../hooks/redux";
import { setUser } from "../../store/userSlice";
import { getFavoriteMovies } from "../../api/moviesApi";
import { setFavoriteMovies } from "../../store/favoritesSlice";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { MonkeyMascot } from "../MonkeyMascot/MonkeyMascot";
import "./index.css";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = "login" | "register";

export function AuthModal({
  isOpen,
  onClose,
}: AuthModalProps): JSX.Element | null {
  const dispatch = useAppDispatch();
  const navigate = useNavigate()

  const [isRendered, setIsRendered] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const [mode, setMode] = useState<AuthMode>("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedName = name.trim();
  const normalizedSurname = surname.trim();

  useEffect(() => {
    if (isOpen) {
      if (!isRendered) {
        setMode("register");
        setEmail("");
        setPassword("");
        setName("");
        setSurname("");
        setErrorMessage("");
        setSuccessMessage("");
        setHasSubmitted(false);
      }
      setIsRendered(true);
      setIsClosing(false);
    } else if (isRendered) {
      setIsClosing(true);
    }
  }, [isOpen, isRendered]);

  if (!isRendered) {
    return null;
  }

  function resetForm(): void {
    setEmail("");
    setPassword("");
    setName("");
    setSurname("");
    setErrorMessage("");
    setSuccessMessage("");
    setHasSubmitted(false);
  }

  function switchToLogin(): void {
    setMode("login");
    resetForm();
  }

  function switchToRegister(): void {
    setMode("register");
    resetForm();
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>): void {
    const bounds = event.currentTarget.getBoundingClientRect();
    const lookX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 5;
    const lookY = ((event.clientY - bounds.top) / bounds.height - 0.28) * 4;

    event.currentTarget.style.setProperty(
      "--look-x",
      `${Math.max(-2, Math.min(2, lookX))}px`,
    );
    event.currentTarget.style.setProperty(
      "--look-y",
      `${Math.max(-2, Math.min(2, lookY))}px`,
    );
  }

  function handlePointerLeave(event: PointerEvent<HTMLDivElement>): void {
    event.currentTarget.style.setProperty("--look-x", "0px");
    event.currentTarget.style.setProperty("--look-y", "0px");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    setHasSubmitted(true);

    if (
      !normalizedEmail ||
      !password ||
      (mode === "register" && (!normalizedName || !normalizedSurname))
    ) {
      setErrorMessage("All fields are required");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      setSuccessMessage("");

      if (mode === "login") {
        const loginResponse = await loginUser({
          email: normalizedEmail,
          password,
        });

        if (!loginResponse?.token) {
          setErrorMessage("Invalid email or password");
          return;
        }

        localStorage.setItem("token", loginResponse.token);
        dispatch(setUser(loginResponse.user));
        navigate("/profile")

        try {
          const favoriteMovies = await getFavoriteMovies();
          dispatch(setFavoriteMovies(favoriteMovies));
        } catch (error) {
          dispatch(setFavoriteMovies([]));
        }

        onClose();
        resetForm();
        setMode("register");
        return;
      }

      await registerUser({
        email: normalizedEmail,
        password,
        name: normalizedName,
        surname: normalizedSurname,
      });
      setMode("login");
      setPassword("");
      setName("");
      setSurname("");
      setErrorMessage("");
      setSuccessMessage(
        "Registration completed successfully. Now sign in with this email and password.",
      );
    } catch (error: any) {
      if (error.response?.status === 409) {
        setErrorMessage("A user with this email already exists");
        return;
      }

      if (error.response?.status === 400) {
        setErrorMessage("Please check the entered data");
        return;
      }

      setErrorMessage(
        mode === "login" ? "Unable to log in" : "Unable to register",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const hasEmailError = hasSubmitted && !email.trim();
  const hasPasswordError = hasSubmitted && !password.trim();
  const hasNameError = mode === "register" && hasSubmitted && !name.trim();
  const hasSurnameError =
    mode === "register" && hasSubmitted && !surname.trim();

  return (
    <div
      className={`modal-overlay ${isClosing ? "modal-overlay--closing" : ""}`}
      aria-hidden={isClosing}
      onClick={isClosing ? undefined : onClose}
      onAnimationEnd={(event) => {
        if (
          isClosing &&
          event.target === event.currentTarget &&
          event.animationName === "overlay-exit"
        ) {
          setIsRendered(false);
        }
      }}
    >
      <div
        className={`auth-modal ${isClosing ? "auth-modal--closing" : ""}`}
        onClick={(event) => event.stopPropagation()}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <button
          type="button"
          className="auth-modal__close btn-close"
          onClick={onClose}
          aria-label="Close"
        >
          <X />
        </button>

        <div className="auth-modal__heading">
          <MonkeyMascot
            className="auth-modal__mascot"
            ariaLabel="MovieLib monkey lying sideways, holding popcorn and watching the pointer"
          />
          <h2 className="auth-modal__title">
            {mode === "login" ? "Login" : "Register"}
          </h2>
        </div>

        <form className="auth-modal__form" onSubmit={handleSubmit}>
          {successMessage && (
            <p className="auth-modal__success">{successMessage}</p>
          )}

          {mode === "register" && (
            <>
              <input
                type="text"
                placeholder="First name"
                autoComplete="given-name"
                required
                className={`auth-modal__input ${hasNameError ? "auth-modal__input_error" : ""}`}
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
              />
              <input
                type="text"
                placeholder="Last name"
                autoComplete="family-name"
                required
                className={`auth-modal__input ${hasSurnameError ? "auth-modal__input_error" : ""}`}
                value={surname}
                onChange={(event) => {
                  setSurname(event.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
              />
            </>
          )}
          <input
            type="email"
            placeholder="Email"
            autoComplete="email"
            required
            className={`auth-modal__input ${hasEmailError ? "auth-modal__input_error" : ""}`}
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (errorMessage) setErrorMessage("");
            }}
          />

          <input
            type="password"
            placeholder="Password"
            autoComplete={
              mode === "register" ? "new-password" : "current-password"
            }
            minLength={mode === "register" ? 8 : undefined}
            required
            className={`auth-modal__input ${hasPasswordError ? "auth-modal__input_error" : ""}`}
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              if (errorMessage) setErrorMessage("");
            }}
          />

          {errorMessage && <p className="auth-modal__error">{errorMessage}</p>}
          <div className="auth-modal__submit-wrap">
            <button
              type="submit"
              className="auth-modal__submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? mode === "login"
                  ? "Logging in..."
                  : "Registering..."
                : mode === "login"
                  ? "Log in"
                  : "Register"}
            </button>
          </div>
        </form>

        <div className="auth-modal__footer">
          {mode === "login" ? (
            <button
              type="button"
              className="auth-modal__switch"
              onClick={switchToRegister}
            >
              Register
            </button>
          ) : (
            <button
              type="button"
              className="auth-modal__switch"
              onClick={switchToLogin}
            >
              Log in
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
