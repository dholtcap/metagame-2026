import SignupForm from "@/components/SignupForm";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl">
        Metagame 2026
      </h1>
      <p className="mt-6 max-w-md text-base text-foreground/60 sm:text-lg">
        Something new is coming. Drop your email and we&apos;ll let you know.
      </p>
      <SignupForm />
    </main>
  );
}
