// possible issue with using sessionstorage
// https://stackoverflow.com/questions/40399873/initializing-and-using-sessionstorage-in-react
// we can probably create a userObject with useRef that persists in every component?

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SignInButton from "../SignInButton";
import { authPredictionUser, User } from "csgo-predict-api";
import { USER_SESSION_STORAGE_KEY } from "../../lib/user-util";

const google = window.google;

const LoginPage = () => {
	const navigate = useNavigate();

	// Sign in with Google Button
	useEffect(() => {
		async function handleCallbackResponse(response: google.accounts.id.CredentialResponse) {
			let user: User;
			try {
				user = await authPredictionUser(response.credential);
			} catch (e) {
				// TODO: Auth didn't work lets do something?
				// Right now, the site doesn't notify the user of any error
				// Maybe just refresh page and start over? This signifies an error with our google auth
				// Since we're in this callback it should succesfully auth
				console.log(e);
				return;
			}

			console.log(`User logged in with email: ${user.email}`);

			document.getElementById("signin-btn")!.style.display = "none";
			sessionStorage.setItem(USER_SESSION_STORAGE_KEY, JSON.stringify(user));
			navigate("/management", { replace: true });
		}

		google.accounts.id.initialize({
			client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID!,
			callback: handleCallbackResponse,
		});

		google.accounts.id.renderButton(document.getElementById("signin-btn")!, {
			type: "standard",
			size: "large",
		});
	}, [navigate]);

	return (
		<div className="login-page">
			<h1>Login Page</h1>
			<SignInButton />
		</div>
	);
};

export default LoginPage;
