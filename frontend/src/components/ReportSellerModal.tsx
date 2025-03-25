import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { toast } from "sonner";

export default function ReportSellerModal({ isOpen, onClose, productId }) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error("Please enter a reason");
      return;
    }

    setIsSubmitting(true);
    try {
      // Get user_id from localStorage or wherever it's stored in your app
      const user_id = localStorage.getItem("uuid"); // Adjust this based on your auth system
      const idToken = localStorage.getItem("idToken"); // Adjust this based on your auth system

      const response = await fetch(
        "https://peer2peermart-y0wq.onrender.com/products/reportProduct",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            user_id: user_id,
            product_id: productId,
            reason: reason.trim(),
          }),
        }
      );
      console.log(
        JSON.stringify({
          user_id: user_id,
          product_id: productId,
          reason: reason.trim(),
        })
      );
      if (!response.ok) {
        throw new Error("Failed to submit report");
      }

      const data = await response.json();
      toast.success("Report submitted successfully");
      setReason("");
      onClose();
    } catch (error) {
      toast.error(
        error.message || "An error occurred while submitting the report"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reason" className="text-right">
                Reason
              </Label>
              <Input
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="col-span-3"
                required
                placeholder="Please describe the issue"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
