import React, { useState } from "react";
import {
  useTickets,
  TicketStatus,
  TicketPriority,
} from "../tickets/TicketContext";
import { useAuth } from "../auth/AuthContext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { notifyError } from "../../lib/errorHandling";

interface TicketFormPageProps {
  ticketId?: string;
  onNavigate: (page: string, ticketId?: string) => void;
}

export const TicketFormPage: React.FC<TicketFormPageProps> = ({
  ticketId,
  onNavigate,
}) => {
  const { getTicket, createTicket, updateTicket } = useTickets();
  const { user } = useAuth();
  const isEdit = !!ticketId;
  const ticket = isEdit ? getTicket(ticketId) : null;

  const [formData, setFormData] = useState({
    title: ticket?.title || "",
    description: ticket?.description || "",
    status: (ticket?.status ?? "open") as TicketStatus,
    priority: (ticket?.priority ?? "medium") as TicketPriority,
    assignee: ticket?.assignee || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (isEdit && !ticket) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8">
        <div className="mx-auto w-full max-w-[1440px] px-4">
          <Card className="mx-auto max-w-3xl rounded-2xl shadow-xl">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <AlertCircle className="mb-4 h-12 w-12 text-gray-400" />
              <h2 className="mb-2">Ticket Not Found</h2>
              <Button onClick={() => onNavigate("tickets")}>
                Back to Tickets
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const STATUS_OPTIONS: Array<{ value: TicketStatus; label: string }> = [
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In Progress" },
    { value: "closed", label: "Closed" },
  ];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const trimmedTitle = formData.title.trim();
    const trimmedDescription = formData.description.trim();

    if (!trimmedTitle) {
      newErrors.title = "Title is required";
    } else if (trimmedTitle.length > 120) {
      newErrors.title = "Title must be 120 characters or less";
    }

    if (!trimmedDescription) {
      newErrors.description = "Description is required";
    } else if (trimmedDescription.length > 2000) {
      newErrors.description = "Description must be 2000 characters or less";
    }

    if (
      !formData.status ||
      !STATUS_OPTIONS.some((option) => option.value === formData.status)
    ) {
      newErrors.status = "Status must be Open, In Progress, or Closed";
    }

    if (!formData.assignee.trim()) newErrors.assignee = "Assignee is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (isEdit && ticketId) {
        updateTicket(ticketId, formData);
        toast.success("Ticket updated successfully!");
        onNavigate("ticket-detail", ticketId);
      } else {
        createTicket({ ...formData, createdBy: user?.email || "Unknown" });
        toast.success("Ticket created successfully!");
        onNavigate("tickets");
      }
    } catch (error) {
      const message = notifyError(
        error,
        "Failed to save ticket. Please retry."
      );
      setErrors((prev) => ({ ...prev, form: message }));
    }
  };

  const teamMembers = [
    "John Doe",
    "Jane Smith",
    "Mike Johnson",
    "Sarah Williams",
    "Robert Brown",
    "Emily Davis",
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8">
      <div className="mx-auto w-full max-w-[1440px] px-4">
        <div className="mx-auto max-w-3xl">
          <Button
            variant="ghost"
            onClick={() =>
              onNavigate(isEdit ? "ticket-detail" : "tickets", ticketId)
            }
            className="mb-6 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <Card className="rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle>
                {isEdit ? "Edit Ticket" : "Create New Ticket"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {errors.form && (
                  <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {errors.form}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="Enter ticket title"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                      if (errors.title) setErrors({ ...errors, title: "" });
                    }}
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the issue or request"
                    rows={5}
                    value={formData.description}
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value });
                      if (errors.description)
                        setErrors({ ...errors, description: "" });
                    }}
                    className={errors.description ? "border-red-500" : ""}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>
                      Status <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: TicketStatus) => {
                        setFormData({ ...formData, status: value });
                        if (errors.status) setErrors({ ...errors, status: "" });
                      }}
                    >
                      <SelectTrigger
                        className={errors.status ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map(({ value, label }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.status && (
                      <p className="text-sm text-red-600">{errors.status}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value: TicketPriority) =>
                        setFormData({ ...formData, priority: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>
                    Assign to <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.assignee}
                    onValueChange={(value: string) => {
                      setFormData({ ...formData, assignee: value });
                      if (errors.assignee)
                        setErrors({ ...errors, assignee: "" });
                    }}
                  >
                    <SelectTrigger
                      className={errors.assignee ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.map((member) => (
                        <SelectItem key={member} value={member}>
                          {member}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.assignee && (
                    <p className="text-sm text-red-600">{errors.assignee}</p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1">
                    {isEdit ? "Update Ticket" : "Create Ticket"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      onNavigate(isEdit ? "ticket-detail" : "tickets", ticketId)
                    }
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
