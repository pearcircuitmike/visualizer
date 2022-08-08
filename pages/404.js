import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/router";

const NotFound = () => {
  // Auto-redirect
  // returns a router object with a redirect method
  // const router = useRouter();

  /* useEffect(() => {
    setTimeout(() => {
      // router.go(-1); go back to previous page (+1 goes forward)
      router.push("/");
    }, 10000);
  }, []);*/

  return (
    <div className="not-found">
      <h1> Oops...</h1>
      <h2> That page cannot be found</h2>
      <p>
        {" "}
        Go back to the{" "}
        <Link href="/">
          <a>homepage</a>
        </Link>
      </p>
    </div>
  );
};

export default NotFound;
