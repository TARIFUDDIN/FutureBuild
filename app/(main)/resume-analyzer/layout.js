import { Suspense } from "react";
import { BarLoader } from "react-spinners";
import Script from "next/script";

export default function Layout({ children }) {
    return (
        <div className="px-5">
            <Script src="//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.8.162/pdf.min.js" strategy="beforeInteractive" />
            <Script src="//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.8.162/pdf.worker.min.js" strategy="beforeInteractive" />

            <Suspense
                fallback={
                    <div className="flex justify-center items-center h-screen">
                        <BarLoader width={"100%"} color="gray" />
                    </div>
                }
            >
                {children}
            </Suspense>
        </div>
    );
}