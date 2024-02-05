import { Link } from "@remix-run/react";

export default function Header() {
    return (
        <header>
            <h1>FF14 SNS</h1>
            <nav>
                <ul>
                    <li><Link to="/auth/login">Login</Link></li>
                    <li><Link to="/auth/signup">Signup</Link></li>
                </ul>
            </nav>
        </header>
    );
}