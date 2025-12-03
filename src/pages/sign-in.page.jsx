import { SignIn } from "@clerk/clerk-react";
import styles from "../pages/signin-up.module.css"; 
import Navigation from "../components/Navigation/Navigation";

const SignInPage = () => {
  return (
    <main className={styles.signInContainer}>
        <Navigation/>
      <SignIn />
    </main>
  );
};

export default SignInPage;
