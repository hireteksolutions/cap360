import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ConsultationModalProps {
  children: React.ReactNode;
}

const ConsultationModal = ({ children }: ConsultationModalProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    currentPosition: "",
    goals: "",
    preferredDate: "",
    preferredTime: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Phone validation (required & exactly 10 digits)
    if (!/^\d{10}$/.test(formData.phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Phone number is required and must be exactly 10 digits.",
        variant: "destructive",
      });
      return;
    }

    // ✅ Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address (e.g. abc@gmail.com).",
        variant: "destructive",
      });
      return;
    }

    // ✅ Date validation (must be today or later)
    if (formData.preferredDate) {
      const selectedDate = new Date(formData.preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        toast({
          title: "Invalid Date",
          description: "Preferred date must be today or later.",
          variant: "destructive",
        });
        return;
      }
    }

    // ✅ Time validation (9 AM – 10 PM)
    if (formData.preferredTime) {
      const [hours, minutes] = formData.preferredTime.split(":").map(Number);
      const timeInMinutes = hours * 60 + minutes;
      const minTime = 9 * 60;   // 9:00 AM
      const maxTime = 22 * 60;  // 10:00 PM

      if (timeInMinutes < minTime || timeInMinutes > maxTime) {
        toast({
          title: "Invalid Time",
          description: "Preferred time must be between 9:00 AM and 10:00 PM.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("consultations").insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          current_position: formData.currentPosition,
          goals: formData.goals,
          preferred_date: formData.preferredDate || null,
          preferred_time: formData.preferredTime || null,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your consultation request has been submitted. We'll contact you soon!",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        currentPosition: "",
        goals: "",
        preferredDate: "",
        preferredTime: "",
      });
    } catch (error) {
      console.error("Error submitting consultation:", error);
      toast({
        title: "Error",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // ✅ Restrict phone input to numbers only (max 10 digits)
    if (name === "phone") {
      if (!/^\d{0,10}$/.test(value)) return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary flex items-center gap-2">
            <Calendar className="h-6 w-6 text-gold-500" />
            Book Your Free Consultation
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Take the first step towards your career transformation. Our experts
            will discuss your goals and create a personalized roadmap for
            success.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-primary">
                Full Name *
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-primary">
                Email Address *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-primary">
                Phone Number *
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentPosition" className="text-primary">
                Current Role/Industry
              </Label>
              <Input
                id="currentPosition"
                name="currentPosition"
                type="text"
                placeholder="e.g., Marketing Manager"
                value={formData.currentPosition}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="goals" className="text-primary">
              Career Goals & Challenges
            </Label>
            <Textarea
              id="goals"
              name="goals"
              placeholder="Tell us about your career goals and any challenges you're facing..."
              className="min-h-[100px]"
              value={formData.goals}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="preferredDate"
                className="text-primary flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Preferred Date
              </Label>
              <Input
                id="preferredDate"
                name="preferredDate"
                type="date"
                value={formData.preferredDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split("T")[0]} // 👈 restrict past dates
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="preferredTime"
                className="text-primary flex items-center gap-2"
              >
                <Clock className="h-4 w-4" />
                Preferred Time
              </Label>
              <Input
                id="preferredTime"
                name="preferredTime"
                type="time"
                value={formData.preferredTime}
                onChange={handleInputChange}
                min="09:00" // 👈 restrict before 9 AM
                max="22:00" // 👈 restrict after 10 PM
              />
            </div>
          </div>

          <div className="bg-gold-50 p-4 rounded-lg">
            <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
              <User className="h-4 w-4" />
              What to Expect:
            </h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• 30-minute personalized consultation</li>
              <li>• Career assessment and goal setting</li>
              <li>• Customized action plan</li>
              <li>• No obligation or sales pressure</li>
            </ul>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gold-500 hover:bg-gold-600 text-white"
            >
              {isSubmitting ? "Submitting..." : "Book My Free Consultation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ConsultationModal;
