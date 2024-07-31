import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

const Navbar = () => {

    return (<nav className="text-white bg-black border-gray-200 ">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <h1>Tictactoe</h1>
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