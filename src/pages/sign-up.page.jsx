import { SignUp } from "@clerk/clerk-react"
import styles from "../pages/signin-up.module.css"; 
import Navigation from "../components/Navigation/Navigation"
const SignUpPage = ()=>{
    return(
        <main className={styles.signUp}>
            <Navigation/>
            <SignUp/>
        </main>
    )
} 
export  default SignUpPage