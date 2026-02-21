import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { CreditCard, Lock, CheckCircle2, Loader2 } from "lucide-react";

interface PaymentModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    amount: number;
}

const PaymentModal = ({ open, onClose, onSuccess, amount }: PaymentModalProps) => {
    const [step, setStep] = useState<"form" | "processing" | "success">("form");
    const [card, setCard] = useState({
        number: "",
        name: "",
        expiry: "",
        cvv: "",
    });

    const formatCardNumber = (value: string) => {
        const cleaned = value.replace(/\D/g, "").slice(0, 16);
        return cleaned.replace(/(.{4})/g, "$1 ").trim();
    };

    const formatExpiry = (value: string) => {
        const cleaned = value.replace(/\D/g, "").slice(0, 4);
        if (cleaned.length > 2) {
            return cleaned.slice(0, 2) + "/" + cleaned.slice(2);
        }
        return cleaned;
    };

    const handleSubmit = () => {
        setStep("processing");
        // Simulate payment processing
        setTimeout(() => {
            setStep("success");
            setTimeout(() => {
                setStep("form");
                setCard({ number: "", name: "", expiry: "", cvv: "" });
                onSuccess();
            }, 1500);
        }, 2000);
    };

    const isFormValid =
        card.number.replace(/\s/g, "").length === 16 &&
        card.name.length > 0 &&
        card.expiry.length === 5 &&
        card.cvv.length === 3;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-primary" />
                        Payment
                    </DialogTitle>
                    <DialogDescription>
                        {step === "form" && "Enter your card details to complete the payment."}
                        {step === "processing" && "Processing your payment securely..."}
                        {step === "success" && "Payment completed successfully!"}
                    </DialogDescription>
                </DialogHeader>

                {step === "form" && (
                    <div className="space-y-4 py-4">
                        <div className="bg-muted/50 rounded-lg p-4 text-center mb-4">
                            <p className="text-sm text-muted-foreground">Amount to Pay</p>
                            <p className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                                ₹{amount.toLocaleString()}
                            </p>
                        </div>

                        <div>
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <Input
                                id="cardNumber"
                                placeholder="1234 5678 9012 3456"
                                value={card.number}
                                onChange={(e) =>
                                    setCard({ ...card, number: formatCardNumber(e.target.value) })
                                }
                                className="mt-1 font-mono"
                                maxLength={19}
                            />
                        </div>

                        <div>
                            <Label htmlFor="cardName">Cardholder Name</Label>
                            <Input
                                id="cardName"
                                placeholder="John Doe"
                                value={card.name}
                                onChange={(e) => setCard({ ...card, name: e.target.value })}
                                className="mt-1"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="expiry">Expiry Date</Label>
                                <Input
                                    id="expiry"
                                    placeholder="MM/YY"
                                    value={card.expiry}
                                    onChange={(e) =>
                                        setCard({ ...card, expiry: formatExpiry(e.target.value) })
                                    }
                                    className="mt-1 font-mono"
                                    maxLength={5}
                                />
                            </div>
                            <div>
                                <Label htmlFor="cvv">CVV</Label>
                                <Input
                                    id="cvv"
                                    placeholder="123"
                                    type="password"
                                    value={card.cvv}
                                    onChange={(e) =>
                                        setCard({
                                            ...card,
                                            cvv: e.target.value.replace(/\D/g, "").slice(0, 3),
                                        })
                                    }
                                    className="mt-1 font-mono"
                                    maxLength={3}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                            <Lock className="h-3 w-3" />
                            <span>
                                This is a simulated payment. No real charges will be made.
                            </span>
                        </div>

                        <Button
                            className="w-full bg-gradient-primary hover:opacity-90 transition-smooth mt-4"
                            size="lg"
                            onClick={handleSubmit}
                            disabled={!isFormValid}
                        >
                            Pay ₹{amount.toLocaleString()}
                        </Button>
                    </div>
                )}

                {step === "processing" && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
                        <p className="text-lg font-medium">Processing Payment...</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Please do not close this window.
                        </p>
                    </div>
                )}

                {step === "success" && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="relative">
                            <CheckCircle2 className="h-20 w-20 text-green-500 animate-in zoom-in-0 duration-300" />
                        </div>
                        <p className="text-lg font-bold mt-4 text-green-500">
                            Payment Successful!
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Redirecting to your orders...
                        </p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default PaymentModal;
