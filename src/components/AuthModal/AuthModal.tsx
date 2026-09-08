import { FormEvent, useState } from "react";
import { loginUser, registerUser } from "../../api/authApi";
import { useAppDispatch } from "../../hooks/redux";
import { setUser } from "../../store/userSlice";
import { getFavoriteMovies } from "../../api/moviesApi";
import { setFavoriteMovies } from "../../store/favoritesSlice";
import { X } from "lucide-react";
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

  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [isEmailTouched, setIsEmailTouched] = useState(false);
  const [password, setPassword] = useState("");
  const [isPasswordTouched, setIsPasswordTouched] = useState(false);
  const [name, setName] = useState("");
  const [isNameTouched, setIsNameTouched] = useState(false);
  const [surname, setSurname] = useState("");
  const [isSurnameTouched, setIsSurnameTouched] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedName = name.trim();
  const normalizedSurname = surname.trim();

  if (!isOpen) {
    return null;
  }

  function resetForm(): void {
    setEmail("");
    setPassword("");
    setName("");
    setSurname("");
    setErrorMessage("");
    setSuccessMessage("");
    setIsEmailTouched(false);
    setIsPasswordTouched(false);
    setIsSurnameTouched(false);
    setIsNameTouched(false);
  }

  function switchToLogin(): void {
    setMode("login");
    resetForm();
  }

  function switchToRegister(): void {
    setMode("register");
    resetForm();
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!email || !password || (mode === "register" && (!name || !surname))) {
      setErrorMessage("All fields are required");
      return;
    }

    const nameRegex = /^[A-Za-zA-Яа-яЁё]+$/;

    if (mode === "register") {
      if (!nameRegex.test(normalizedName)) {
        setErrorMessage("Name must contain only letters");
        return;
      }

      if (!nameRegex.test(normalizedSurname)) {
        setErrorMessage("Surname must contain only letters");
        return;
      }
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

        try {
          const favoriteMovies = await getFavoriteMovies();
          dispatch(setFavoriteMovies(favoriteMovies));
        } catch (error) {
          dispatch(setFavoriteMovies([]));
        }

        onClose();
        resetForm();
        setMode("login");
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

  const hasEmailError = isEmailTouched && !email.trim();
  const hasPasswordError = isPasswordTouched && !password.trim();
  const hasNameError = mode === "register" && isNameTouched && !name.trim();
  const hasSurnameError =
    mode === "register" && isSurnameTouched && !surname.trim();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          className="auth-modal__close btn-close"
          onClick={onClose}
          aria-label="Close"
        >
          <X />
        </button>

        <h2 className="auth-modal__title">
          {mode === "login" ? "Login" : "Register"}
        </h2>

        <form className="auth-modal__form" onSubmit={handleSubmit}>
          {successMessage && (
            <p className="auth-modal__success">{successMessage}</p>
          )}

          {mode === "register" && (
            <>
              <input
                type="text"
                placeholder="First name"
                className={`auth-modal__input ${hasNameError ? "auth-modal__input_error" : ""}`}
                onBlur={() => setIsNameTouched(true)}
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              <input
                type="text"
                placeholder="Last name"
                className={`auth-modal__input ${hasSurnameError ? "auth-modal__input_error" : ""}`}
                onBlur={() => setIsSurnameTouched(true)}
                value={surname}
                onChange={(event) => setSurname(event.target.value)}
              />
            </>
          )}
          <input
            type="email"
            placeholder="Email"
            className={`auth-modal__input ${hasEmailError ? "auth-modal__input_error" : ""}`}
            onBlur={() => setIsEmailTouched(true)}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className={`auth-modal__input ${hasPasswordError ? "auth-modal__input_error" : ""}`}
            onBlur={() => setIsPasswordTouched(true)}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          {errorMessage && <p className="auth-modal__error">{errorMessage}</p>}

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
