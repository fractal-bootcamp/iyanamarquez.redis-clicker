import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

const Navbar = () => {

    return (<nav className="bg-blue-200 border-gray-200 ">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <h1>Button Clicker</h1>
            <span className="self-center text-2xl font-semibold whitespace-nowrap ">
                <SignedOut>
                    <SignInButton />
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </span>
        </div>
    </nav>)

}

export default Navbar;