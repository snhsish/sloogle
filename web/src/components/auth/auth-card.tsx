"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import { Label } from "../ui/label";
import { ArrowRight, LockIcon, MailIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Spinner } from "../ui/spinner";

export default function AuthCard({ }) {
    const router = useRouter();

    const [loading, setLoading] = useState<boolean>(false);
    const [step, setStep] = useState<"email" | "otp">("email");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [otp, setOtp] = useState<string>("");

    const sendOTP = async () => {
        setLoading(true);

        const { error } = await authClient.emailOtp.sendVerificationOtp({
            email,
            type: "sign-in"
        });

        if (!error) {
            setStep("otp");
        } else {
            setErrorMessage(error.message ?? "An unknown error occured. Please retry after a while.");
            // console.error(error);
        }

        setLoading(false);
    }

    const verifyOTP = async () => {
        setLoading(true);

        const { data, error } = await authClient.signIn.emailOtp({
            email, otp
        });

        if (!error) {
            console.log("[AUTH]: SIGNED IN");
        } else {
            setErrorMessage(error.message ?? "Invalid OTP");
            setLoading(false);
            // console.error(error);
        }

        if (data) {
            router.push("/configure");
        }
    }

    if (step === "otp")
        return (
            <div className="w-md flex flex-col gap-2 mt-5">
                <Label className="text-muted-foreground">Enter the verification code sent to your email</Label>
                <div className="w-full flex flex-row gap-2 items-center justify-center">
                    <InputGroup className="w-full rounded-full">
                        <InputGroupInput
                            id="verification-code"
                            name="verification-code"
                            type="text"
                            placeholder="Verfication Code"
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <InputGroupAddon>
                            <LockIcon />
                        </InputGroupAddon>
                    </InputGroup>

                    <Button
                        size="icon"
                        className="rounded-full"
                        disabled={loading}
                        onClick={verifyOTP}
                    >
                        {loading ? <Spinner /> : <ArrowRight />}
                    </Button>
                </div>
            </div>
        )
    else
        return (
            <div className="w-md flex flex-col gap-2 mt-5">
                <Label className="text-muted-foreground">Continue with your email</Label>
                <div className="w-full flex flex-row gap-2 items-center justify-center">
                    <InputGroup className="w-full rounded-full">
                        <InputGroupInput
                            id="email"
                            name="email"
                            type="email"
                            placeholder="name@example.com"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <InputGroupAddon>
                            <MailIcon />
                        </InputGroupAddon> 
                    </InputGroup>

                    <Button
                        size="icon"
                        className="rounded-full"
                        disabled={loading}
                        onClick={sendOTP}
                    >
                        {loading ? <Spinner /> : <ArrowRight />}
                    </Button>
                </div>
            </div>
        )
}